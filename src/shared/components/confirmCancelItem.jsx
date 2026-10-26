import { Modal, notification } from "antd";

const confirmCancelItem = (runCancel) => {
  Modal.confirm({
    title: "Cancel this item?",
    content: "This action cannot be undone.",
    okText: "Cancel item",
    okButtonProps: { danger: true },
    cancelText: "Keep item",
    onOk: () =>
      new Promise((resolve, reject) => {
        runCancel({
          onSuccess: () => {
            notification.success({ message: "Item cancelled successfully" });
            resolve();
          },
          onError: (error) => {
            notification.error({
              message: "Unable to cancel item",
              description: error.response?.data?.message || "Please try again.",
            });
            reject(new Error("Cancellation failed"));
          },
        });
      }),
  });
};

export default confirmCancelItem;
