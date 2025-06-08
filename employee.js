// Initialize default users if not present
if (!localStorage.getItem("users")) {
  const defaultUsers = [
    { name: "Ravi Kumar", email: "ravi.kumar@example.com", password: "ravi123", role: "employee" },
    { name: "Sneha Patel", email: "sneha.patel@example.com", password: "sneha123", role: "employee" },
    { name: "Amit Singh", email: "amit.singh@example.com", password: "amit123", role: "employee" },
    { name: "Priya Sharma", email: "priya.sharma@example.com", password: "priya123", role: "employee" },
    { name: "Yathisha Sadula", email: "yathisha@example.com", password: "yathisha123", role: "employee" },
    { name: "Manager", email: "manager@example.com", password: "manager123", role: "manager" }
  ];
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// On page load
window.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const historyTableBody = document.getElementById("historyTableBody");

  // Leave History Page
  if (historyTableBody) {
    let leaves = JSON.parse(localStorage.getItem("leaves")) || [];

    if (currentUser?.role !== "manager") {
      leaves = leaves.filter(l => l.userEmail === currentUser?.email);
    }

    if (leaves.length === 0) {
      historyTableBody.innerHTML = `<tr><td colspan="6">No leave records found.</td></tr>`;
      return;
    }

    historyTableBody.innerHTML = "";
    leaves.forEach((leave, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${leave.startDate}</td>
        <td>${leave.endDate}</td>
        <td>${leave.leaveName}</td>
        <td>${leave.partialDays}</td>
        <td>${leave.status}</td>
        <td id="action-${index}"></td>
      `;
      historyTableBody.appendChild(row);

      const actionCell = document.getElementById(`action-${index}`);
      if (currentUser?.role === "manager" && leave.status === "Pending") {
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.onclick = () => updateLeaveStatus(index, "Approved");

        const rejectBtn = document.createElement("button");
        rejectBtn.textContent = "Reject";
        rejectBtn.onclick = () => updateLeaveStatus(index, "Rejected");

        actionCell.appendChild(approveBtn);
        actionCell.appendChild(rejectBtn);
      }
    });
  }

  // Apply Leave Page
  const leaveForm = document.getElementById("leaveForm");
  if (leaveForm) {
    leaveForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const leaveType = document.getElementById("leaveType").value;
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;
      const partialDays = document.getElementById("partialDays").value;
      const reason = document.getElementById("reason").value;

      const newLeave = {
        userEmail: currentUser?.email,
        userName: currentUser?.name,
        leaveName: leaveType,
        startDate,
        endDate,
        partialDays,
        reason,
        status: "Pending"
      };

      let leaves = JSON.parse(localStorage.getItem("leaves")) || [];
      leaves.push(newLeave);
      localStorage.setItem("leaves", JSON.stringify(leaves));

      alert("Leave submitted successfully.");
      leaveForm.reset();
    });
  }

  // Manager Dashboard Logic
  const leaveTable = document.getElementById("leaveRequestTable");
  const totalLeaves = document.getElementById("totalLeaves");
  const pendingLeaves = document.getElementById("pendingLeaves");
  const approvedLeaves = document.getElementById("approvedLeaves");

  if (leaveTable && currentUser?.role === "manager") {
    const leaves = JSON.parse(localStorage.getItem("leaves")) || [];

    // Set summary
    totalLeaves.textContent = leaves.length;
    pendingLeaves.textContent = leaves.filter(l => l.status === "Pending").length;
    approvedLeaves.textContent = leaves.filter(l => l.status === "Approved").length;

    // Show leaves in table
    leaveTable.innerHTML = "";

    if (leaves.length === 0) {
      leaveTable.innerHTML = `<tr><td colspan="6">No leave requests found.</td></tr>`;
      return;
    }

    leaves.forEach((leave, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${leave.userName}</td>
        <td>${leave.leaveName}</td>
        <td>${leave.startDate}</td>
        <td>${leave.endDate}</td>
        <td>${leave.status}</td>
        <td id="manager-action-${index}"></td>
      `;
      leaveTable.appendChild(tr);

      const actionCell = document.getElementById(`manager-action-${index}`);
      if (leave.status === "Pending") {
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.onclick = () => updateLeaveStatus(index, "Approved");

        const rejectBtn = document.createElement("button");
        rejectBtn.textContent = "Reject";
        rejectBtn.onclick = () => updateLeaveStatus(index, "Rejected");

        actionCell.appendChild(approveBtn);
        actionCell.appendChild(rejectBtn);
      }
    });
  }
});

// Update status
function updateLeaveStatus(index, status) {
  const leaves = JSON.parse(localStorage.getItem("leaves")) || [];
  leaves[index].status = status;
  localStorage.setItem("leaves", JSON.stringify(leaves));
  location.reload();
}

// Login
function validate() {
  const email = document.getElementById("box").value;
  const password = document.getElementById("box1").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    alert("Login successful");
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "index.html";
  } else {
    alert("Invalid credentials");
  }
}
