import Modal from "rc/modal";

ReactDOM.render(<Page />, application);

function Page() {
    return <div>
        <Modal>
            <div className="content">content</div>
        </Modal>
    </div>
}
