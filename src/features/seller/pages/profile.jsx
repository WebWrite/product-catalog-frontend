import { useState } from "react";
import { App, Button, Card, Result, Skeleton, Tag } from "antd";
import { KeyOutlined, LockOutlined } from "@ant-design/icons";

import { initials } from "../../../shared/utils/initialsName";

import {
  useGetSellerProfile,
  useUpdateSellerProfile,
  useChangeSellerPassword,
} from "../hooks/useSellerprofile";

import SellerProfileForm from "../components/sellerProfileForm";
import ChangePasswordModal from "../components/changepasswordModal";

function Profile() {
  const { notification } = App.useApp();

  const [passwordModal, setPasswordModal] = useState(false);

  const { data: profile, isLoading, isError, refetch } = useGetSellerProfile();

  const updateProfileMutation = useUpdateSellerProfile();
  const changePasswordMutation = useChangeSellerPassword();

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  if (isError || !profile) {
    return (
      <Result
        status="error"
        title="Unable to load seller profile"
        extra={<Button onClick={() => refetch()}>Try Again</Button>}
      />
    );
  }
  const handleProfileUpdate = (values) => {
    const changes = {};

    if (values.name.trim() !== (profile.name || "")) {
      changes.name = values.name.trim();
    }

    if (values.storeName.trim() !== (profile.sellerProfile?.storeName || "")) {
      changes.storeName = values.storeName.trim();
    }

    if (values.storeType !== (profile.sellerProfile?.storeType || "")) {
      changes.storeType = values.storeType;
    }

    if (Object.keys(changes).length === 0) {
      notification.info({
        title: "No changes detected",
        description: "Please update at least one profile field before saving.",
        placement: "top",
      });
      return;
    }

    updateProfileMutation.mutate(changes, {
      onSuccess: () => {
        notification.success({
          title: "Profile updated",
          description: "Your profile was updated successfully.",
          placement: "top",
        });
      },

      onError: (error) => {
        notification.error({
          title: "Profile update failed",
          description:
            error.response?.data?.message ||
            error.message ||
            "Failed to update profile.",
          placement: "top",
        });
      },
    });
  };

  const handlePasswordChange = (values, onSuccess) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        notification.success({
          title: "Password changed",
          description: "Your password was changed successfully.",
          placement: "top",
        });

        onSuccess();
      },
      onError: (error) => {
        notification.error({
          title: "Password change failed",
          description:
            error.response?.data?.message || "Failed to change password.",
          placement: "top",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] p-4 sm:p-6">
        <Skeleton active paragraph={{ rows: 2 }} />

        <div className="mt-5 grid gap-4 lg:grid-cols-[2.2fr_1fr]">
          <Skeleton active paragraph={{ rows: 7 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[var(--bg)] p-4 sm:p-6">
        <Result
          status="error"
          title="Unable to load seller profile"
          extra={
            <Button
              type="primary"
              onClick={() => refetch()}
              className="profile-primary-button"
            >
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  const storeName = profile.sellerProfile?.storeName || "";
  const storeType = profile.sellerProfile?.storeType || "";

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] p-4 text-[var(--text)] sm:p-6">
      {/* Profile Header */}
      <section className="theme-panel my-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 sm:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-base font-semibold text-blue-500">
            {initials(profile.name || "")}
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--text-h)]">
              {profile.name}
            </h2>

            <p className="mt-1 text-xs text-[var(--text)]">{profile.email}</p>

            <p className="mt-1 text-xs text-[var(--text)]">
              Store:{" "}
              <span className="font-medium text-blue-500">
                {storeName || "N/A"}
              </span>
            </p>

            <p className="mt-1 text-xs text-[var(--text)]">
              Member Since:{" "}
              <span className="font-medium text-[var(--text-h)]">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Tag className="profile-blue-tag capitalize">{profile.role}</Tag>

              {storeType && <Tag className="profile-blue-tag">{storeType}</Tag>}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[2.2fr_1fr]">
          <SellerProfileForm
            profile={profile}
            isSaving={updateProfileMutation.isPending}
            onSubmit={handleProfileUpdate}
          />

          <Card
            className="profile-card h-fit"
            styles={{ body: { padding: 24 } }}
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10">
              <KeyOutlined className="text-lg text-blue-500" />
            </div>

            <h3 className="mb-2 text-sm font-bold text-[var(--text-h)]">
              Password & Credentials
            </h3>

            <p className="mb-4 text-xs text-[var(--text)]">
              Manage your account password and security.
            </p>

            <Button
              type="primary"
              block
              icon={<LockOutlined />}
              onClick={() => setPasswordModal(true)}
              className="profile-primary-button h-10 rounded-full"
            >
              Change Account Password
            </Button>
          </Card>
        </div>

        <ChangePasswordModal
          open={passwordModal}
          isSaving={changePasswordMutation.isPending}
          onClose={() => setPasswordModal(false)}
          onSubmit={handlePasswordChange}
        />
      </div>
    </div>
  );
}

export default Profile;
