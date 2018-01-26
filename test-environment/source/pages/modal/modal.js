import Modal from "ReactConstruct/modal";


export default function () {
    return <div>
        <div className={styles.outside_content}>Content</div>

        <Modal onClose={reason => console.log(`Close by: ${getReason(reason)}`)}>
            <div className={styles.modal_box}>
                <div className={styles.modal_content}>
                    Text
                </div>
            </div>
        </Modal>
    </div>
}

function getReason(reason) {
    for (let key in Modal.closeReason) {
        if (reason == Modal.closeReason[key]) return key;
    }
}
