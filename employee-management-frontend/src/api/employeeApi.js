const BASE_URL = "http://localhost:8080/api/employees";

export const getAllEmployees = async () => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch employees");
    return response.json();
};

export const getEmployeeById = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch employee");
    return response.json();
};

export const createEmployee = async (employeeData) => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData)
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Failed to create employee");
    }
    return response.json();
};

export const updateEmployee = async (id, employeeData) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData)
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Failed to update employee");
    }
    return response.json();
};

export const deleteEmployee = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    });
    if (!response.ok) throw new Error("Failed to delete employee");
    return true; // DELETE usually returns 204 No Content
};

export const searchEmployees = async (keyword) => {
    const response = await fetch(`${BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error("Failed to search employees");
    return response.json();
};
