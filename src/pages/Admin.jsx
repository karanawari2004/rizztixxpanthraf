
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Admin.css";
import "./Report.css";

export default function Admin({
  user,
  onLogout,
  onUserUpdate,
  onSessionExpired,
}) {
  const navigate = useNavigate();

  const [clubName, setClubName] = useState("");
  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(false);

  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventId, setEventId] = useState("");

  const [topUps, setTopUps] = useState("");
  const [sales, setSales] = useState("");
  const [devices, setDevices] = useState("");
  const [days, setDays] = useState("");

  const [card, setCard] = useState("");
  const [cash, setCash] = useState("");
  const [upi, setUpi] = useState("");


  const [coverAmount, setCoverAmount] = useState("");
  const [updateAmount, setUpdateAmount] = useState("");

  const [activations, setActivations] = useState("");
  const [activationRate, setActivationRate] = useState("");

  const [manPower, setManPower] = useState("");
  const [manpowerRate, setManpowerRate] = useState("");

  const [licenceFeeRate, setLicenceFeeRate] = useState("");
  const [gstRate, setGstRate] = useState("");

  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchClubName, setSearchClubName] = useState("");
  const [searchEventDate, setSearchEventDate] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [accountMode, setAccountMode] = useState("");
  const [accountUsername, setAccountUsername] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [currentUsername, setCurrentUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [newPassword, setNewPassword] = useState("");
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountNotice, setAccountNotice] = useState(null);

  
  const handleAddClub = () => {
    navigate("/add-club");
  };

  const openAccountForm = (mode) => {
    setAccountMode(mode);
    setAccountNotice(null);
    setCurrentUsername(user?.username || "");
    setNewUsername(user?.username || "");
    setCurrentPassword("");
    setNewPassword("");
    setAccountUsername("");
    setAccountPassword("");
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setAccountSaving(true);
    setAccountNotice(null);

    try {
      if (accountMode === "add") {
        await api.post("/accounts", {
          username: accountUsername.trim(),
          password: accountPassword,
        });
        setAccountUsername("");
        setAccountPassword("");
        setAccountNotice({
          type: "success",
          message: "Account added successfully.",
        });
      } else {
        const response = await api.put("/accounts/credentials", {
          currentUsername,
          currentPassword,
          newUsername: newUsername.trim(),
          newPassword,
        });
        onUserUpdate?.(response.data.user);
        setCurrentUsername(response.data.user.username);
        setNewUsername(response.data.user.username);
        setCurrentPassword("");
        setNewPassword("");
        setAccountNotice({
          type: "success",
          message: "Username and password updated successfully.",
        });
      }
    } catch (error) {
      setAccountNotice({
        type: "error",
        message:
          error.response?.data?.message ||
          "Unable to update the account. Please try again.",
      });
    } finally {
      setAccountSaving(false);
    }
  };


  const fetchClubs = useCallback(async () => {
    try {
      setClubsLoading(true);

      const response = await api.get("/clubs");

      if (response.data?.success) {
        setClubs(
          Array.isArray(response.data.data)
            ? response.data.data
            : []
        );
      } else {
        setClubs([]);

        console.error(
          "Unable to fetch clubs:",
          response.data?.message
        );
      }
    } catch (error) {
      console.error(
        "Fetch clubs error:",
        error.response?.data || error.message
      );

      setClubs([]);
    } finally {
      setClubsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  
  const handleClubChange = (e) => {
    const selectedClubName = e.target.value;

    setClubName(selectedClubName);

    const selectedClub = clubs.find(
      (club) => club.clubName === selectedClubName
    );

    if (selectedClub) {
      setLicenceFeeRate(String(selectedClub.licenceFee ?? ""));
      setActivationRate(String(selectedClub.activationRate ?? ""));
      setManpowerRate(String(selectedClub.manPowerRate ?? ""));
      setGstRate(String(selectedClub.gstRate ?? ""));
    } else {
      setLicenceFeeRate("");
      setActivationRate("");
      setManpowerRate("");
      setGstRate("");
    }
  };

  
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    api.post("/logout").catch((error) => {
      console.error("Logout API error:", error.response?.data || error.message);
    });
    navigate("/", { replace: true });
  };

  
  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);

      const response = await api.get("/admin");

      if (response.data?.success) {
        const reports =
          response.data.reports ?? response.data.data;

        setHistory(Array.isArray(reports) ? reports : []);
      } else {
        setHistory([]);

        console.error(
          "History response:",
          response.data?.message || "Unable to fetch reports."
        );
      }
    } catch (error) {
      console.error(
        "Fetch history error:",
        error.response?.data || error.message
      );

      setHistory([]);

      if (error.response?.status === 401) {
        onSessionExpired?.();
        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to fetch report history. Please check the server connection."
      );
    } finally {
      setHistoryLoading(false);
    }
  }, [onSessionExpired]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  
  const resetForm = () => {
    setEditingId(null);
    setClubName("");
    setEventDate("");
    setEventEndDate("");
    setEventId("");

    setTopUps("");
    setSales("");
    setDevices("");
    setDays("");

    setCard("");
    setCash("");
    setUpi("");

    
    setCoverAmount("");
    setUpdateAmount("");

    setActivations("");
    setActivationRate("");

    setManPower("");
    setManpowerRate("");

    setLicenceFeeRate("");
    setGstRate("");
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !clubName.trim() ||
      !eventId.trim() ||
      !eventDate ||
      !eventEndDate
    ) {
      alert(
        "Please select a club and enter the event ID, start date, and end date."
      );
      return;
    }

    const startDate = new Date(`${eventDate}T00:00:00`);
    const endDate = new Date(`${eventEndDate}T00:00:00`);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      alert("Please enter valid event dates.");
      return;
    }

    if (endDate < startDate) {
      alert("Event end date cannot be earlier than the start date.");
      return;
    }

    if (
      activationRate.trim() === "" ||
      manpowerRate.trim() === "" ||
      licenceFeeRate.trim() === "" ||
      gstRate.trim() === ""
    ) {
      alert("Please select a club with all four rates configured.");
      return;
    }

    const numericValues = {
      topups: Number(topUps || 0),
      sales: Number(sales || 0),
      devices: Number(devices || 0),
      days: Number(days || 1),

      card: Number(card || 0),
      cash: Number(cash || 0),
      upi: Number(upi || 0),

      // NEW FIELDS
      coverAmount: Number(coverAmount || 0),
      updateAmount: Number(updateAmount || 0),

      activations: Number(activations || 0),
      activationRate: Number(activationRate),

      manPower: Number(manPower || 0),
      manpowerRate: Number(manpowerRate),

      licenceFeeRate: Number(licenceFeeRate),
      gstRate: Number(gstRate),
    };

    for (const [field, value] of Object.entries(numericValues)) {
      if (!Number.isFinite(value) || value < 0) {
        alert(`${field} must be a valid non-negative number.`);
        return;
      }
    }

    if (
      numericValues.licenceFeeRate > 100 ||
      numericValues.gstRate > 100
    ) {
      alert("Licence Fee and GST rates cannot exceed 100%.");
      return;
    }

    if (!Number.isInteger(numericValues.devices)) {
      alert("Devices must be a whole number.");
      return;
    }

    if (
      !Number.isInteger(numericValues.days) ||
      numericValues.days < 1
    ) {
      alert("Days must be a whole number greater than zero.");
      return;
    }

    if (
      !Number.isInteger(numericValues.activations) ||
      !Number.isInteger(numericValues.manPower)
    ) {
      alert("Activations and manpower must be whole numbers.");
      return;
    }

    const formData = {
      clubName: clubName.trim(),
      eventId: eventId.trim(),
      eventDate,
      eventEndDate,
      ...numericValues,
    };

    try {
      setLoading(true);

      console.log("Submitting report:", formData);

      const response = editingId
        ? await api.put(`/admin/${editingId}`, formData)
        : await api.post("/admin", formData);

      if (response.data?.success) {
        console.log(
          editingId ? "Updated report:" : "Saved report:",
          response.data.report ?? response.data.data
        );

        alert(
          editingId
            ? "Report updated successfully!"
            : "Report saved successfully!"
        );

        resetForm();

        await fetchHistory();
      } else {
        alert(response.data?.message || "Unable to save report.");
      }
    } catch (error) {
      console.error(
        "Save report error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to save report. Please check the server connection."
      );
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (date) => {
    if (!date) return "-";

    const dateString = String(date);

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");

      const monthName = new Date(
        `${dateString}T00:00:00`
      ).toLocaleDateString("en-IN", {
        month: "short",
      });

      return `${day} ${monthName} ${year}`;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  
  const handleView = async (id) => {
    if (!id) {
      alert("Report ID is missing.");
      return;
    }

    try {
      const response = await api.get(`/admin/${id}`);

      const selectedReport =
        response.data?.report ?? response.data?.data;

      if (response.data?.success && selectedReport) {
        console.log("Selected report:", selectedReport);

        navigate("/report", {
          state: {
            report: selectedReport,
          },
        });
      } else {
        alert(
          response.data?.message ||
            "Unable to load the selected report."
        );
      }
    } catch (error) {
      console.error(
        "View report error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to open the report. Please check the server connection."
      );
    }
  };

  
  const handleEdit = async (id) => {
    if (!id) {
      alert("Report ID is missing.");
      return;
    }

    try {
      const response = await api.get(`/admin/${id}`);
      const report = response.data?.report ?? response.data?.data;

      if (!response.data?.success || !report) {
        alert(response.data?.message || "Unable to load report for editing.");
        return;
      }

      setEditingId(id);
      setClubName(report.clubName || "");
      setEventId(report.eventId || "");
      setEventDate(report.eventDate ? String(report.eventDate).slice(0, 10) : "");
      setEventEndDate(
        report.eventEndDate ? String(report.eventEndDate).slice(0, 10) : ""
      );

      setTopUps(String(report.topups ?? report.topUps ?? ""));
      setSales(String(report.sales ?? ""));
      setDevices(String(report.devices ?? ""));
      setDays(String(report.days ?? ""));
      setCard(String(report.card ?? ""));
      setCash(String(report.cash ?? ""));
      setUpi(String(report.upi ?? ""));

      // NEW FIELDS
      setCoverAmount(String(report.coverAmount ?? ""));
      setUpdateAmount(String(report.updateAmount ?? ""));

      setActivations(String(report.activations ?? ""));
      setActivationRate(String(report.activationRate ?? ""));
      setManPower(String(report.manPower ?? ""));
      setManpowerRate(String(report.manpowerRate ?? ""));
      setLicenceFeeRate(String(report.licenceFeeRate ?? ""));
      setGstRate(String(report.gstRate ?? ""));

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Edit report error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Unable to load report for editing.");
    }
  };

  
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/admin/${id}`);

      if (response.data?.success) {
        setHistory((previousHistory) =>
          previousHistory.filter((item) => item._id !== id)
        );

        alert("Report deleted successfully.");
      } else {
        alert(
          response.data?.message || "Unable to delete report."
        );
      }
    } catch (error) {
      console.error(
        "Delete report error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete the report."
      );
    }
  };

  // Filter report history independently by club name and event start date.
  // If both fields are entered, reports must match both filters.
  const filteredHistory = history.filter((item) => {
    const clubSearch = searchClubName.trim().toLowerCase();
    const dateSearch = searchEventDate.trim();

    const reportClubName = String(item.clubName || "").toLowerCase();
    const reportStartDate = String(item.eventDate || "").slice(0, 10);

    const matchesClub =
      !clubSearch || reportClubName.includes(clubSearch);
    const matchesDate =
      !dateSearch || reportStartDate === dateSearch;

    return matchesClub && matchesDate;
  });

  const handlePreview = () => {
    if (!clubName.trim() || !eventId.trim() || !eventDate || !eventEndDate) {
      alert("Please select a club and enter the event ID, start date, and end date before previewing.");
      return;
    }

    if (new Date(`${eventEndDate}T00:00:00`) < new Date(`${eventDate}T00:00:00`)) {
      alert("Event end date cannot be earlier than the start date.");
      return;
    }

    setPreviewData({
      clubName: clubName.trim(),
      eventId: eventId.trim(),
      eventDate,
      eventEndDate,
      topUps: topUps || "0",
      sales: sales || "0",
      devices: devices || "0",
      days: days || "1",
      card: card || "0",
      cash: cash || "0",
      upi: upi || "0",
      coverAmount: coverAmount || "0",
      updateAmount: updateAmount || "0",
      activations: activations || "0",
      activationRate: activationRate || "0",
      manPower: manPower || "0",
      manpowerRate: manpowerRate || "0",
      licenceFeeRate: licenceFeeRate || "0",
      gstRate: gstRate || "0",
    });
    setPreviewOpen(true);
  };

  const previewMoney = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Club Management</h1>

        <div className="admin-actions">
          <button
            type="button"
            className="admin-report-link"
            onClick={() => {
              if (history.length === 0) {
                alert(
                  "No reports available. Please create a report first."
                );
                return;
              }

              handleView(history[0]._id);
            }}
          >
            View Latest Report
          </button>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleAddClub}
          >
            Add Club
          </button>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={() => openAccountForm("add")}
          >
            Add Account
          </button>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={() => openAccountForm("change")}
          >
            Change Credentials
          </button>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {accountMode && (
        <section className="account-management-panel">
          <h2>
            {accountMode === "add" ? "Add Account" : "Change Credentials"}
          </h2>

          {accountNotice && (
            <p
              className={`account-management-message ${accountNotice.type}`}
              role={accountNotice.type === "error" ? "alert" : "status"}
            >
              {accountNotice.message}
            </p>
          )}

          <form
            className="account-management-form"
            onSubmit={handleAccountSubmit}
          >
            {accountMode === "change" ? (
              <>
                <div>
                  <label htmlFor="currentUsername">Current Username</label>
                  <input
                    id="currentUsername"
                    type="text"
                    value={currentUsername}
                    onChange={(e) => setCurrentUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </>
            ) : null}

            <div>
              <label htmlFor="accountNewUsername">
                {accountMode === "add" ? "Username" : "New Username"}
              </label>
              <input
                id="accountNewUsername"
                type="text"
                value={accountMode === "add" ? accountUsername : newUsername}
                onChange={(e) =>
                  accountMode === "add"
                    ? setAccountUsername(e.target.value)
                    : setNewUsername(e.target.value)
                }
                autoComplete="username"
                maxLength={64}
                required
              />
            </div>

            <div>
              <label htmlFor="accountNewPassword">
                {accountMode === "add" ? "Password" : "New Password"}
              </label>
              <input
                id="accountNewPassword"
                type="password"
                value={accountMode === "add" ? accountPassword : newPassword}
                onChange={(e) =>
                  accountMode === "add"
                    ? setAccountPassword(e.target.value)
                    : setNewPassword(e.target.value)
                }
                autoComplete="new-password"
                required
              />
            </div>

            <div className="account-management-actions">
              <button type="submit" disabled={accountSaving}>
                {accountSaving
                  ? "Saving..."
                  : accountMode === "add"
                    ? "Add Account"
                    : "Update Credentials"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccountMode("");
                  setAccountNotice(null);
                }}
                disabled={accountSaving}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="admin-content">
        <form id="admin-report-form" className="admin-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Update Club Report" : "Create Club Report"}</h2>

        
          <div className="form-group">
            <label htmlFor="clubName">Club Name</label>

            <select
              id="clubName"
              value={clubName}
              onChange={handleClubChange}
              required
              disabled={clubsLoading}
            >
              <option value="">
                {clubsLoading ? "Loading clubs..." : "Select a club"}
              </option>

              {clubs.map((club) => (
                <option key={club._id} value={club.clubName}>
                  {club.clubName}
                </option>
              ))}
            </select>

            {!clubsLoading && clubs.length === 0 && (
              <small>
                No clubs found. Please add a club first.
              </small>
            )}
          </div>

          
          <div className="form-group">
            <label htmlFor="eventId">Event ID</label>

            <input
              type="text"
              id="eventId"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="Enter event ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventDate">Event Start Date</label>

            <input
              type="date"
              id="eventDate"
              value={eventDate}
              onClick={(e) => e.currentTarget.showPicker?.()}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventEndDate">Event End Date</label>

            <input
              type="date"
              id="eventEndDate"
              value={eventEndDate}
              min={eventDate || undefined}
              onClick={(e) => e.currentTarget.showPicker?.()}
              onChange={(e) => setEventEndDate(e.target.value)}
              required
            />
          </div>

          <hr />

          <h3>Sales Details</h3>

          <div className="form-group">
            <label htmlFor="topUps">Top Ups</label>

            <input
              type="number"
              id="topUps"
              min="0"
              step="0.01"
              value={topUps}
              onChange={(e) => setTopUps(e.target.value)}
              placeholder="Enter top ups"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sales">Sales</label>

            <input
              type="number"
              id="sales"
              min="0"
              step="0.01"
              value={sales}
              onChange={(e) => setSales(e.target.value)}
              placeholder="Enter sales"
            />
          </div>

          <div className="form-group">
            <label htmlFor="devices">Devices</label>

            <input
              type="number"
              id="devices"
              min="0"
              step="1"
              value={devices}
              onChange={(e) => setDevices(e.target.value)}
              placeholder="Enter number of devices"
            />
          </div>

          <div className="form-group">
            <label htmlFor="days">Days</label>

            <input
              type="number"
              id="days"
              min="1"
              step="1"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="Enter number of days"
            />
          </div>

          <hr />

          <h3>Payment Details</h3>

          <div className="form-group">
            <label htmlFor="card">Card</label>

            <input
              type="number"
              id="card"
              min="0"
              step="0.01"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              placeholder="Enter card amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cash">Cash</label>

            <input
              type="number"
              id="cash"
              min="0"
              step="0.01"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              placeholder="Enter cash amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="upi">UPI</label>

            <input
              type="number"
              id="upi"
              min="0"
              step="0.01"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              placeholder="Enter UPI amount"
            />
          </div>

          
          <div className="form-group">
            <label htmlFor="coverAmount">Cover Amount</label>

            <input
              type="number"
              id="coverAmount"
              min="0"
              step="0.01"
              value={coverAmount}
              onChange={(e) => setCoverAmount(e.target.value)}
              placeholder="Enter cover amount"
            />
          </div>

          
          <div className="form-group">
            <label htmlFor="updateAmount">Update Amount</label>

            <input
              type="number"
              id="updateAmount"
              min="0"
              step="0.01"
              value={updateAmount}
              onChange={(e) => setUpdateAmount(e.target.value)}
              placeholder="Enter update amount"
            />
          </div>

          <hr />

          <h3>Activation &amp; Manpower Details</h3>

          <div className="form-group">
            <label htmlFor="activations">
              Activations (Quantity)
            </label>

            <input
              type="number"
              id="activations"
              min="0"
              step="1"
              value={activations}
              onChange={(e) => setActivations(e.target.value)}
              placeholder="Enter number of activations"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="activationRate">
              Activation Rate (₹ per activation)
            </label>

            <input
              type="number"
              id="activationRate"
              min="0"
              step="0.001"
              value={activationRate}
              placeholder="Automatically filled from selected club"
              readOnly
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="manPower">Manpower (Quantity)</label>

            <input
              type="number"
              id="manPower"
              min="0"
              step="1"
              value={manPower}
              onChange={(e) => setManPower(e.target.value)}
              placeholder="Enter manpower quantity"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="manpowerRate">
              Manpower Rate (₹ per unit)
            </label>

            <input
              type="number"
              id="manpowerRate"
              min="0"
              step="0.01"
              value={manpowerRate}
              placeholder="Automatically filled from selected club"
              readOnly
              required
            />
          </div>

          <hr />

          <h3>Fee &amp; Tax Rates</h3>

          <div className="form-group">
            <label htmlFor="licenceFeeRate">
              Licence Fee Rate (%)
            </label>

            <input
              type="number"
              id="licenceFeeRate"
              min="0"
              max="100"
              step="0.01"
              value={licenceFeeRate}
              placeholder="Automatically filled from selected club"
              readOnly
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gstRate">GST Rate (%)</label>

            <input
              type="number"
              id="gstRate"
              min="0"
              max="100"
              step="0.01"
              value={gstRate}
              placeholder="Automatically filled from selected club"
              readOnly
              required
            />
          </div>

          <button
            type="button"
            className="admin-preview-btn"
            onClick={handlePreview}
            disabled={loading}
          >
            Preview Payslip
          </button>

          <button
            type="submit"
            className="admin-save-btn"
            disabled={loading}
          >
            {loading
              ? editingId
                ? "Updating..."
                : "Saving..."
              : editingId
                ? "Update Report"
                : "Save Report"}
          </button>

          {editingId && (
            <button
              type="button"
              className="history-delete-btn"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel Update
            </button>
          )}
        </form>

        <section className="history-section">
          <div className="history-search">
            <div className="search-field">
              <label htmlFor="searchClubName">
                Search by Club Name
              </label>
              <input
                type="search"
                id="searchClubName"
                placeholder="Enter club name..."
                value={searchClubName}
                onChange={(e) => setSearchClubName(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label htmlFor="searchEventDate">
                Search by Event Start Date
              </label>
              <input
                type="date"
                id="searchEventDate"
                value={searchEventDate}
                onClick={(e) => e.currentTarget.showPicker?.()}
                onChange={(e) => setSearchEventDate(e.target.value)}
              />
            </div>

            {(searchClubName || searchEventDate) && (
              <button
                type="button"
                onClick={() => {
                  setSearchClubName("");
                  setSearchEventDate("");
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="history-heading">
            <h2>Report History</h2>

            <button
              type="button"
              onClick={fetchHistory}
              disabled={historyLoading}
            >
              {historyLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {historyLoading ? (
            <p>Loading report history...</p>
          ) : filteredHistory.length === 0 ? (
            <p>
              {searchClubName || searchEventDate
                ? "No matching reports found."
                : "No reports found."}
            </p>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Club Name</th>
                    <th>Event ID</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>View</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item._id}>
                      <td>{item.clubName || "-"}</td>
                      <td>{item.eventId || "-"}</td>
                      <td>{formatDate(item.eventDate)}</td>
                      <td>{formatDate(item.eventEndDate)}</td>

                      <td>
                        <button
                          type="button"
                          className="history-view-btn"
                          onClick={() => handleView(item._id)}
                        >
                          View
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="history-update-btn"
                          onClick={() => handleEdit(item._id)}
                        >
                          Update
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="history-delete-btn"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {previewOpen && previewData && (
        <div
          className="payslip-preview-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-title"
        >
          <div className="payslip-preview-modal">
            <div className="payslip-preview-toolbar">
              <h2 id="preview-title">Payslip Preview</h2>
              <button
                type="button"
                className="preview-close-btn"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
              >
                ×
              </button>
            </div>

            {/*
              Preview uses the same payslip class names and table structure
              as Report.jsx / Report.css so it looks like the final payslip.
            */}
            <div className="payslip preview-payslip">
              <div className="payslip-brand">
                <div className="atomx-text-logo">
                  <span className="atomx-name">PayNthra</span>
                  <span className="atomx-highlight">atomx</span>
                </div>
              </div>

              <div className="payslip-heading">
                <h2>PAYSLIP</h2>
                <h3 className="payslip-club">{previewData.clubName}</h3>
                <p className="payslip-date">
                  {formatDate(previewData.eventDate)} - {formatDate(previewData.eventEndDate)}
                </p>
                <p className="report-description">
                  Event ID: {previewData.eventId || "-"}
                </p>
              </div>

              <table className="payslip-table">
                <thead>
                  <tr><th colSpan="2" className="table-heading">SUMMARY</th></tr>
                </thead>
                <tbody>
                  <tr><td className="report-label">TOPUPS</td><td className="report-amount">{previewMoney(previewData.topUps)}</td></tr>
                  <tr><td className="report-label">SALES</td><td className="report-amount">{previewMoney(previewData.sales)}</td></tr>
                  <tr><td className="report-label">DEVICES</td><td className="report-amount">{previewData.devices}</td></tr>
                  <tr><td className="report-label">DAYS</td><td className="report-amount">{previewData.days}</td></tr>
                  <tr className="bold-row">
                    <td className="report-label">
                      BREAKAGE
                      <small className="preview-formula">(TOPUPS - SALES - ACTIVATION AMOUNT)</small>
                    </td>
                    <td className="report-amount">
                      {previewMoney(
                        Number(previewData.topUps) -
                        Number(previewData.sales) -
                        (Number(previewData.activations) *
                          (Number(previewData.activationRate) === 84.746 ? 100 : Number(previewData.activationRate)))
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="payslip-table">
                <thead>
                  <tr><th colSpan="2" className="section-heading">AMOUNT WITH PayNthra</th></tr>
                </thead>
                <tbody>
                  <tr><td className="report-label">CARD</td><td className="report-amount">{previewMoney(previewData.card)}</td></tr>
                  <tr><td className="report-label">CASH (HANDOVER)</td><td className="report-amount">{previewMoney(previewData.cash)}</td></tr>
                  {Number(previewData.coverAmount) > 0 && (
                    <tr><td className="report-label">COVER (HANDOVER)</td><td className="report-amount">{previewMoney(previewData.coverAmount)}</td></tr>
                  )}
                  <tr><td className="report-label">UPI</td><td className="report-amount">{previewMoney(previewData.upi)}</td></tr>
                  {Number(previewData.updateAmount) > 0 && (
                    <tr><td className="report-label">UPDATE AMOUNT</td><td className="report-amount">{previewMoney(previewData.updateAmount)}</td></tr>
                  )}
                  <tr className="bold-row">
                    <td className="report-label">SUB TOTAL</td>
                    <td className="report-amount">{previewMoney(Number(previewData.card) + Number(previewData.upi) + Number(previewData.updateAmount))}</td>
                  </tr>
                  <tr className="bold-row">
                    <td className="report-label">TOTAL</td>
                    <td className="report-amount">{previewMoney(Number(previewData.card) + Number(previewData.upi) + Number(previewData.updateAmount))}</td>
                  </tr>
                </tbody>
              </table>

              <table className="payslip-table">
                <thead>
                  <tr><th colSpan="2" className="section-heading">INVOICE</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="report-label">
                      LICENCE FEE ({previewData.licenceFeeRate}%)
                      <small className="preview-formula">(TOPUPS × {previewData.licenceFeeRate}%)</small>
                    </td>
                    <td className="report-amount">
                      {previewMoney(Number(previewData.topUps) * Number(previewData.licenceFeeRate) / 100)}
                    </td>
                  </tr>
                  <tr>
                    <td className="report-label">
                      ACTIVATIONS ({previewData.activations} × ₹{Number(previewData.activationRate).toLocaleString("en-IN")})
                    </td>
                    <td className="report-amount">
                      {previewMoney(Number(previewData.activations) * Number(previewData.activationRate))}
                    </td>
                  </tr>
                  <tr>
                    <td className="report-label">
                      MANPOWER ({previewData.manPower} × ₹{Number(previewData.manpowerRate).toLocaleString("en-IN")})
                    </td>
                    <td className="report-amount">
                      {previewMoney(Number(previewData.manPower) * Number(previewData.manpowerRate))}
                    </td>
                  </tr>
                  <tr className="bold-row">
                    <td className="report-label">SUB TOTAL</td>
                    <td className="report-amount">
                      {previewMoney(
                        Number(previewData.topUps) * Number(previewData.licenceFeeRate) / 100 +
                        Number(previewData.activations) * Number(previewData.activationRate) +
                        Number(previewData.manPower) * Number(previewData.manpowerRate)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="report-label">GST ({previewData.gstRate}%)</td>
                    <td className="report-amount">
                      {previewMoney(
                        (Number(previewData.topUps) * Number(previewData.licenceFeeRate) / 100 +
                        Number(previewData.activations) * Number(previewData.activationRate) +
                        Number(previewData.manPower) * Number(previewData.manpowerRate)) *
                        Number(previewData.gstRate) / 100
                      )}
                    </td>
                  </tr>
                  <tr className="bold-row">
                    <td className="report-label">TOTAL</td>
                    <td className="report-amount">
                      {(() => {
                        const invoiceSubTotal =
                          Number(previewData.topUps) * Number(previewData.licenceFeeRate) / 100 +
                          Number(previewData.activations) * Number(previewData.activationRate) +
                          Number(previewData.manPower) * Number(previewData.manpowerRate);
                        return previewMoney(invoiceSubTotal + invoiceSubTotal * Number(previewData.gstRate) / 100);
                      })()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="payslip-table">
                <tbody>
                  <tr className="payable-row">
                    <td className="report-label">PAYABLE</td>
                    <td className="report-amount">
                      {(() => {
                        const invoiceSubTotal =
                          Number(previewData.topUps) * Number(previewData.licenceFeeRate) / 100 +
                          Number(previewData.activations) * Number(previewData.activationRate) +
                          Number(previewData.manPower) * Number(previewData.manpowerRate);
                        const invoiceTotal = invoiceSubTotal + invoiceSubTotal * Number(previewData.gstRate) / 100;
                        return previewMoney(
                          Number(previewData.topUps) -
                          Number(previewData.cash) -
                          invoiceTotal -
                          Number(previewData.coverAmount)
                        );
                      })()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="payslip-footer">
                <p className="payslip-confidential">
                  This report is confidential and intended for authorized use only.
                </p>
                <p className="payslip-reference">Ref: Generated after saving</p>
                <p className="payslip-reference">Preview only - not saved</p>
              </div>
            </div>

            <div className="payslip-preview-actions">
              <button
                type="button"
                className="preview-back-btn"
                onClick={() => setPreviewOpen(false)}
              >
                Back to Edit
              </button>
              <button
                type="button"
                className="admin-save-btn"
                disabled={loading}
                onClick={() => {
                  setPreviewOpen(false);
                  document.getElementById("admin-report-form")?.requestSubmit();
                }}
              >
                {loading ? "Saving..." : editingId ? "Confirm Update" : "Confirm & Save Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
