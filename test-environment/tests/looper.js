function looper(settings) {
    let messageHandler;

    settings.page.on("console", ({ type, args }) => {
        if (type != "log") return;
        if (typeof messageHandler != "function") return;

        messageHandler(...args);
    });

    Promise.all([
        new Promise(async resolve => {
            const dataFromMessage = message => {
                return new Promise((resolve, reject) => {
                    messageHandler = async (messageProvider, dataPropdider) => {
                        let currentMessage = await messageProvider.jsonValue();

                        if (currentMessage != message) return;

                        let data = await dataPropdider.jsonValue();

                        resolve(data);
                    }
                });
            };
            const receivedMessage = message => {
                return new Promise(resolve => {
                    messageHandler = async (messageProvider) => {
                        let currentMessage = await messageProvider.jsonValue();

                        if (currentMessage != message) return;

                        resolve();
                    }
                });
            };

            await settings.messageLoop({ receivedMessage, dataFromMessage });
            resolve();
        }),
        new Promise(async resolve => {
            await settings.browserLoop();
            resolve();
        })
    ]).then(() => settings.done());
}

module.exports = looper;
