const STORAGE_KEY = "personalFinanceTransactions_v1";

const Storage = {
  getAll() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Gagal membaca data:", error);
      return [];
    }
  },
  saveAll(transactions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
