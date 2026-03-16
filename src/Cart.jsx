import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/cart.css";
import Loader from "./Loading";
import { api_path } from "../data";
import EmptyBag from "/images/openbag.jpg";
import prints from "/images/spiral-binding-icon.png";
import { useNavigate } from "react-router-dom";

function CartMobile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [confirmOrderId, setConfirmOrderId] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${api_path}/user/printorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.user) {
          setUser(response.data.user);
          setOrders(response.data.orders || []);
        } else {
          setUser(null);
          setOrders([]);
        }
      } catch (error) {
        console.error("Fetch user profile error:", error);
        setUser(null);
        setOrders([]);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const goToPrints = () => navigate("/orderprints");

  const getPaymentMethod = (order) => {
    return order.paymentMethod || order.payment || "-";
  };

  const getPaymentStatus = (order) => {
    const status = order.paymentStatus || order.paymentstatus || "";

    if (status) {
      const normalized = String(status).toLowerCase();

      if (normalized === "paid") return "Paid";
      if (normalized === "pending") return "Pending";
      if (normalized === "failed") return "Failed";

      return status;
    }

    const method = (order.paymentMethod || order.payment || "").toLowerCase();
    const txnId =
      order.transactionId ||
      order.razorpayPaymentId ||
      order.transctionid ||
      "";

    if (
      method === "razorpay" ||
      method === "online" ||
      method === "upi" ||
      method === "card"
    ) {
      return txnId ? "Paid" : "Pending";
    }

    if (
      method === "pay on delivery" ||
      method === "cash on delivery" ||
      method === "cod"
    ) {
      return "Pending";
    }

    return "-";
  };

  const getTransactionId = (order) => {
    return (
      order.transactionId ||
      order.razorpayPaymentId ||
      order.transctionid ||
      "-"
    );
  };

  const getDeliveryStatus = (order) => {
    return order.deliveryStatus || order.deliverystatus || order.status || "-";
  };

  const shouldShowTransactionId = (order) => {
    const method = (order.paymentMethod || order.payment || "").toLowerCase();

    return (
      method &&
      method !== "pay on delivery" &&
      method !== "cash on delivery" &&
      method !== "cod"
    );
  };

  const canCancelOrder = (order) => {
    return (
      String(order?.status || "")
        .trim()
        .toLowerCase() === "order placed"
    );
  };

  const handleAskCancel = (orderId, e) => {
    e.stopPropagation();
    setMessage("");
    setConfirmOrderId(orderId);
  };

  const handleKeepOrder = (e) => {
    e.stopPropagation();
    setConfirmOrderId(null);
  };

  const handleCancelOrder = async (orderId, e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCancellingOrderId(orderId);
      setMessage("");

      const response = await axios.patch(
        `${api_path}/orders/cancelorder/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const updatedOrder = response?.data?.order;

      setOrders((prev) =>
        prev.map((item) =>
          (item._id || item.id) === orderId
            ? { ...item, ...(updatedOrder || {}), status: "Cancelled" }
            : item,
        ),
      );

      setSelectedOrder((prev) => {
        if (!prev) return prev;
        if ((prev._id || prev.id) !== orderId) return prev;
        return { ...prev, ...(updatedOrder || {}), status: "Cancelled" };
      });

      setConfirmOrderId(null);
      setMessage(response?.data?.message || "Order cancelled successfully");
    } catch (error) {
      console.error("Cancel order error:", error);
      setMessage(
        error?.response?.data?.message ||
          "Unable to cancel order. Please try again.",
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="orders-login-prompt cart-login-wrap">
        Please{" "}
        <a href="/login" className="orders-login-btn">
          Login
        </a>{" "}
        to view your profile and orders.
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="cart-page">
        <div className="cart-mobile-root">
          <header className="cart-header">
            <span className="cart-title">My Bag</span>
          </header>

          <div className="cart-tabs cart-tabs-single">
            <span className="cart-tab cart-tab-active">Print Zone</span>
          </div>

          {message && <div className="cart-inline-message">{message}</div>}

          {orders.length === 0 ? (
            <div className="empty-bag">
              <img src={EmptyBag} alt="Empty bag" className="empty-bag-img" />
              <p className="empty-bag-text">
                Don't leave me empty like this 😢 — add something cute!
              </p>
              <button className="cart-blue-btn" onClick={goToPrints}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-mobile-list">
              {orders.map((order) => {
                const orderId = order._id || order.id;
                const isCancelling = cancellingOrderId === orderId;
                const isConfirming = confirmOrderId === orderId;

                return (
                  <div
                    className="cart-mobile-card"
                    key={orderId}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="cart-card-row">
                      <div className="cart-card-left">
                        <img
                          src={prints}
                          alt="Printouts"
                          className="cart-card-icon"
                        />

                        <div className="cart-card-content">
                          <div className="cart-card-title">Printouts</div>

                          <div className="cart-card-meta">
                            Binding: {order.binding || "None"}
                          </div>

                          {canCancelOrder(order) && !isConfirming && (
                            <button
                              type="button"
                              className="cart-cancel-btn cart-cancel-btn-below"
                              onClick={(e) => handleAskCancel(orderId, e)}
                            >
                              Cancel Order
                            </button>
                          )}

                          {canCancelOrder(order) && isConfirming && (
                            <div
                              className="cart-cancel-confirm-box"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="cart-cancel-confirm-text">
                                Cancel this order?
                              </div>

                              <div className="cart-cancel-confirm-actions">
                                <button
                                  type="button"
                                  className="cart-confirm-yes-btn"
                                  onClick={(e) => handleCancelOrder(orderId, e)}
                                  disabled={isCancelling}
                                >
                                  {isCancelling
                                    ? "Cancelling..."
                                    : "Yes, Cancel"}
                                </button>

                                <button
                                  type="button"
                                  className="cart-confirm-no-btn"
                                  onClick={handleKeepOrder}
                                  disabled={isCancelling}
                                >
                                  Keep Order
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="cart-card-side">
                        {!!order.originalprice &&
                          Number(order.discountprice || order.originalprice) <
                            Number(order.originalprice) && (
                            <div className="cart-card-oldprice">
                              ₹{order.originalprice}
                            </div>
                          )}

                        <div className="cart-card-price">
                          ₹{order.discountprice || order.originalprice || 0}
                        </div>

                        <div className="cart-card-qty">
                          Qty: {order.copies || "-"}
                        </div>

                        <div className="cart-card-status">
                          Delivery Status: {getDeliveryStatus(order)}
                        </div>

                        <div className="cart-card-status">
                          Payment Status: {getPaymentStatus(order)}
                        </div>
                      </div>
                    </div>

                    <div className="cart-card-link">View Details →</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  const selectedOrderId = selectedOrder._id || selectedOrder.id;
  const selectedIsConfirming = confirmOrderId === selectedOrderId;
  const selectedIsCancelling = cancellingOrderId === selectedOrderId;

  return (
    <div className="cart-page">
      <div className="order-detail-mobile">
        <header className="cart-header">
          <span className="cart-back" onClick={() => setSelectedOrder(null)}>
            ←
          </span>
          <span className="cart-title">Order Details</span>
        </header>

        {message && <div className="cart-inline-message">{message}</div>}

        <div className="order-detail-info">
          <div className="detail-field">
            <span className="detail-label">Order ID:</span>
            <span className="detail-value">{selectedOrderId}</span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{selectedOrder.name || "-"}</span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Mobile:</span>
            <span className="detail-value">{selectedOrder.mobile || "-"}</span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Payment Method:</span>
            <span className="detail-value">
              {getPaymentMethod(selectedOrder)}
            </span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Payment Status:</span>
            <span className="detail-value">
              {getPaymentStatus(selectedOrder)}
            </span>
          </div>

          {shouldShowTransactionId(selectedOrder) && (
            <div className="detail-field">
              <span className="detail-label">Transaction ID:</span>
              <span className="detail-value">
                {getTransactionId(selectedOrder)}
              </span>
            </div>
          )}

          <div className="detail-field">
            <span className="detail-label">Delivery Status:</span>
            <span className="detail-value">
              {getDeliveryStatus(selectedOrder)}
            </span>
          </div>

          <div className="detail-field">
            <span className="detail-label">File:</span>
            <span className="detail-value">
              {selectedOrder?.file ? (
                <a
                  href={selectedOrder.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-link"
                >
                  View PDF
                </a>
              ) : (
                "No file available"
              )}
            </span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Final Price:</span>
            <span className="detail-value">
              ₹{selectedOrder.discountprice || selectedOrder.price || 0}
            </span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Original Price:</span>
            <span className="detail-value">
              ₹{selectedOrder.originalprice || 0}
            </span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Color:</span>
            <span className="detail-value">{selectedOrder.color || "-"}</span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Side(s):</span>
            <span className="detail-value">{selectedOrder.sides || "-"}</span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Binding:</span>
            <span className="detail-value">{selectedOrder.binding || "-"}</span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Copies:</span>
            <span className="detail-value">{selectedOrder.copies || "-"}</span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Address:</span>
            <span className="detail-value">
              {selectedOrder.address ? (
                selectedOrder.address
              ) : (
                <span className="detail-address-block">
                  {selectedOrder.college && (
                    <>
                      <strong>College:</strong> {selectedOrder.college}
                      <br />
                    </>
                  )}
                  {selectedOrder.year && (
                    <>
                      <strong>Year:</strong> {selectedOrder.year}
                      <br />
                    </>
                  )}
                  {selectedOrder.rollno && (
                    <>
                      <strong>Roll No:</strong> {selectedOrder.rollno}
                      <br />
                    </>
                  )}
                  {selectedOrder.section && (
                    <>
                      <strong>Branch:</strong> {selectedOrder.section}
                    </>
                  )}
                </span>
              )}
            </span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Description:</span>
            <span className="detail-value">
              {selectedOrder.description || "-"}
            </span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Order Date:</span>
            <span className="detail-value">
              {selectedOrder.orderDate
                ? new Date(selectedOrder.orderDate).toLocaleString()
                : "-"}
            </span>
          </div>

          {canCancelOrder(selectedOrder) && !selectedIsConfirming && (
            <button
              type="button"
              className="cart-cancel-btn cart-cancel-detail-btn"
              onClick={(e) => handleAskCancel(selectedOrderId, e)}
            >
              Cancel Order
            </button>
          )}

          {canCancelOrder(selectedOrder) && selectedIsConfirming && (
            <div className="cart-cancel-confirm-box">
              <div className="cart-cancel-confirm-text">Cancel this order?</div>

              <div className="cart-cancel-confirm-actions">
                <button
                  type="button"
                  className="cart-confirm-yes-btn"
                  onClick={(e) => handleCancelOrder(selectedOrderId, e)}
                  disabled={selectedIsCancelling}
                >
                  {selectedIsCancelling ? "Cancelling..." : "Yes, Cancel"}
                </button>

                <button
                  type="button"
                  className="cart-confirm-no-btn"
                  onClick={(e) => handleKeepOrder(e)}
                  disabled={selectedIsCancelling}
                >
                  Keep Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartMobile;
