import { Button, Empty, Flex, Tag, Typography, theme } from "antd";
import Loader from "./loader";
import { getPalette } from "./orderUi";
import OrderCard from "./orderCard";

const { Title, Text } = Typography;

const OrdersList = ({
  title,
  subtitle,
  emptyText,
  errorText,
  orders,
  isLoading,
  isError,
  onRetry,
  HeaderIcon,
  renderItemActions,
  darkCardBg,
}) => {
  const { token } = theme.useToken();
  const isDark = token.colorBgContainer !== "#ffffff";
  const colors = getPalette(isDark, darkCardBg);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl p-4">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <Flex vertical align="center" gap={12} className="p-8">
        <Text>{errorText}</Text>
        <Button onClick={onRetry}>Try again</Button>
      </Flex>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
      <div>
        <Flex align="center" gap={12} wrap="wrap">
          <Title level={2} className="!mb-0">
            {title}
          </Title>
          <Tag
            variant="filled"
            style={{ background: colors.strip, color: colors.accentText }}
          >
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </Tag>
        </Flex>
        <Text style={{ color: colors.muted }}>{subtitle}</Text>
      </div>

      {orders.length === 0 ? (
        <Empty description={emptyText} />
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            HeaderIcon={HeaderIcon}
            renderItemActions={renderItemActions}
            colors={colors}
            token={token}
          />
        ))
      )}
    </div>
  );
};

export default OrdersList;
