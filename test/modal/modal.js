import Modal from "rc/modal";


ReactDOM[window.isServerSideRendered ? "hydrate" : "render"](<Page />, application);

function Page() {
    return <div>
        <Modal>
            <div className="content">content</div>
        </Modal>
    </div>
}
