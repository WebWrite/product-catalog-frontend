import { Card, Divider, Flex, Grid, Tag, Typography } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import {
  capitalize,
  formatDate,
  getTotals,
  methodLabels,
  statusLabels,
} from "./orderUi";

const { Text } = Typography;

const labelStyle = (colors) => ({
  color: colors.muted,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.5,
});

const SummaryRow = ({ label, children, colors }) => (
  <Flex justify="space-between" align="center" gap={12}>
    <Text style={{ color: colors.muted }}>{label}</Text>
    <Text strong>{children}</Text>
  </Flex>
);

const OrderCard = ({ order, HeaderIcon, renderItemActions, colors, token }) => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const { subtotal, shipping, total } = getTotals(order);
  const date = formatDate(order.createdAt);
  const method = methodLabels[order.paymentMethod] || order.paymentMethod;

  return (
    <Card
      styles={{ body: { padding: isMobile ? 12 : 16 } }}
      style={{
        borderColor: colors.border,
        background: colors.cardBg,
        boxShadow: colors.shadow,
      }}
    >
      <Flex
        vertical={isMobile}
        align={isMobile ? "flex-start" : "center"}
        justify="space-between"
        gap={isMobile ? 4 : 12}
        style={{
          background: colors.strip,
          border: `1px solid ${colors.border}`,
          borderRadius: token.borderRadiusLG,
          padding: "12px 16px",
        }}
      >
        <Flex align="center" gap={10} style={{ minWidth: 0 }}>
          <HeaderIcon style={{ color: colors.accent }} />
          <Text strong style={{ wordBreak: "break-all" }}>
            Order #{order._id}
          </Text>
        </Flex>
        {date && (
          <Text style={{ color: colors.muted, fontSize: isMobile ? 12 : 14 }}>
            {date}
          </Text>
        )}
      </Flex>

      {order.items.map((item, index) => {
        const actions = renderItemActions(order, item);

        return (
          <div key={item._id}>
            {index > 0 && (
              <Divider style={{ margin: 0, borderColor: colors.border }} />
            )}

            <div style={{ padding: isMobile ? "14px 0" : "16px 4px" }}>
              <Flex
                gap={isMobile ? 12 : 16}
                align={isMobile ? "flex-start" : "center"}
              >
                <img
                  src={item.productId?.image?.url}
                  alt={item.name}
                  style={{
                    width: isMobile ? 72 : 88,
                    height: isMobile ? 72 : 88,
                    flexShrink: 0,
                    objectFit: "cover",
                    borderRadius: token.borderRadiusLG,
                    background: token.colorFillSecondary,
                  }}
                />

                <Flex vertical gap={6} style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ fontSize: 16 }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: colors.muted }}>
                    Qty {item.quantity}
                    {item.size ? ` · Size ${item.size}` : ""}
                  </Text>
                  <div>
                    <Tag
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        padding: "2px 10px",
                        ...colors.status[item.status],
                      }}
                    >
                      {statusLabels[item.status] || item.status}
                    </Tag>
                  </div>
                </Flex>

                <Flex
                  vertical
                  align="flex-end"
                  gap={12}
                  style={{ flexShrink: 0 }}
                >
                  <Text strong style={{ fontSize: 16 }}>
                    PKR {item.itemTotal}
                  </Text>
                  {!isMobile && actions && (
                    <Flex gap={8} justify="flex-end">
                      {actions}
                    </Flex>
                  )}
                </Flex>
              </Flex>

              {isMobile && actions && (
                <Flex
                  gap={8}
                  className="[&>button]:flex-1"
                  style={{ marginTop: 14 }}
                >
                  {actions}
                </Flex>
              )}
            </div>
          </div>
        );
      })}

      <Divider style={{ margin: 0, borderColor: colors.border }} />

      {isMobile ? (
        <Flex vertical gap={10} style={{ paddingTop: 14 }}>
          <SummaryRow label="Payment method" c={colors}>
            <CreditCardOutlined style={{ color: colors.accent }} /> {method}
          </SummaryRow>
          <SummaryRow label="Payment status" c={colors}>
            {capitalize(order.paymentStatus)}
          </SummaryRow>
          <SummaryRow label="Subtotal" c={colors}>
            PKR {subtotal}
          </SummaryRow>
          {shipping != null && (
            <SummaryRow label="Shipping" c={colors}>
              PKR {shipping}
            </SummaryRow>
          )}
          <Divider style={{ margin: "2px 0", borderColor: colors.border }} />
          <Flex justify="space-between" align="center">
            <Text strong style={{ fontSize: 18 }}>
              Total
            </Text>
            <Text strong style={{ fontSize: 20, color: colors.accent }}>
              PKR {total}
            </Text>
          </Flex>
        </Flex>
      ) : (
        <Flex
          align="flex-end"
          justify="space-between"
          gap={16}
          style={{ paddingTop: 16 }}
        >
          <Flex gap={40}>
            <Flex vertical gap={4}>
              <Text style={labelStyle(colors)}>Payment method</Text>
              <Text strong>
                <CreditCardOutlined style={{ color: colors.accent }} /> {method}
              </Text>
            </Flex>
            <Flex vertical gap={4}>
              <Text style={labelStyle(colors)}>Payment status</Text>
              <Text strong>{capitalize(order.paymentStatus)}</Text>
            </Flex>
          </Flex>

          <Flex vertical align="flex-end" gap={4}>
            <Text style={{ color: colors.muted }}>
              Subtotal PKR {subtotal}
              {shipping != null ? ` · Shipping PKR ${shipping}` : ""}
            </Text>
            <Text strong style={{ fontSize: 20 }}>
              Total <span style={{ color: colors.accent }}>PKR {total}</span>
            </Text>
          </Flex>
        </Flex>
      )}
    </Card>
  );
};

export default OrderCard;
