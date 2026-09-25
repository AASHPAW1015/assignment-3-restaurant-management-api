// local server when running on this machine, Render when deployed
const isLocal =
  location.protocol === "file:" ||
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1";

const API_BASE_URL = isLocal
  ? "http://localhost:3000"
  : "https://assignment-3-restaurant-management-api-j0s9.onrender.com";

// fetch wrapper: adds the JWT if we have one and returns { response, data }
function callApi(path, method, body) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${path}`, {
    method: method || "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then((response) => response.json().then((data) => ({ response, data })));
}

function showError(text) {
  Swal.fire({ icon: "error", title: "Oops...", text });
}

function showSuccess(text) {
  return Swal.fire({ icon: "success", title: "Success", text });
}

// token missing or expired -> back to login
function handleUnauthorized(response, data) {
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Swal.fire({ icon: "error", title: "Oops...", text: data.message }).then(
      () => {
        location.href = "login.html";
      },
    );
    return true;
  }
  return false;
}

function requireLogin() {
  if (!localStorage.getItem("token")) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "please login first!",
    }).then(() => {
      location.href = "index.html";
    });
    return false;
  }
  return true;
}
