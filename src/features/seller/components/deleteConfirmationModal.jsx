
import { Button, Modal } from "antd";

function DeleteConfirmationModal({ open,onCancel,onConfirm,loading = false, title,description,confirmText = "Delete",}) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={title}
      onOk={onConfirm}
      okText={confirmText}
      okButtonProps={{ danger: true }}
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      closable={!loading}
      maskClosable={!loading}
      centered
      destroyOnClose
    >
      <p className="text-sm text-slate-400 m-0 leading-relaxed">
        {description}
      </p>
    </Modal>
  );
}

export default DeleteConfirmationModal;
