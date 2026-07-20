// Utility Functions and Helpers
class Utils {
  // Date and time utilities
  static formatDate(date, format = "short") {
    const d = new Date(date);

    switch (format) {
      case "short":
        return d.toLocaleDateString();
      case "long":
        return d.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "time":
        return d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "datetime":
        return d.toLocaleString();
      default:
        return d.toLocaleDateString();
    }
  }

  static getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return this.formatDate(date);
  }

  static getWeekNumber(date = new Date()) {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  // Number formatting utilities
  static formatNumber(num, decimals = 0) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  }

  static formatCurrency(amount, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  static formatPercentage(value, decimals = 1) {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  }

  // String utilities
  static truncateText(text, maxLength = 100, suffix = "...") {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  }

  static capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static camelToTitle(str) {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  }

  // Array utilities
  static groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  }

  static sortBy(array, key, direction = "asc") {
    return array.sort((a, b) => {
      const aVal = typeof key === "function" ? key(a) : a[key];
      const bVal = typeof key === "function" ? key(b) : b[key];

      if (direction === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  static unique(array, key = null) {
    if (!key) {
      return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  // Object utilities
  static deepClone(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map((item) => this.deepClone(item));
    if (typeof obj === "object") {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  static mergeDeep(target, source) {
    const output = { ...target };

    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = this.mergeDeep(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }

    return output;
  }

  static isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  // Color utilities
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  static rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  static getContrastColor(hexColor) {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return "#000000";

    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#ffffff";
  }

  // DOM utilities
  static createElement(tag, className = "", innerHTML = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  static addEventListenerOnce(element, event, handler) {
    const onceHandler = (e) => {
      handler(e);
      element.removeEventListener(event, onceHandler);
    };
    element.addEventListener(event, onceHandler);
  }

  static fadeIn(element, duration = 300) {
    element.style.opacity = "0";
    element.style.display = "block";

    const start = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      element.style.opacity = progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  static fadeOut(element, duration = 300) {
    const start = performance.now();
    const startOpacity = parseFloat(element.style.opacity) || 1;

    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      element.style.opacity = startOpacity * (1 - progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = "none";
      }
    };

    requestAnimationFrame(animate);
  }

  // Validation utilities
  static isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static sanitizeHtml(html) {
    const div = document.createElement("div");
    div.textContent = html;
    return div.innerHTML;
  }

  // Performance utilities
  static debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Local storage utilities with compression
  static compressData(data) {
    try {
      return btoa(JSON.stringify(data));
    } catch (error) {
      console.warn("Data compression failed:", error);
      return JSON.stringify(data);
    }
  }

  static decompressData(compressedData) {
    try {
      return JSON.parse(atob(compressedData));
    } catch (error) {
      // Fallback to regular JSON parse if not compressed
      try {
        return JSON.parse(compressedData);
      } catch (parseError) {
        console.error("Data decompression failed:", parseError);
        return null;
      }
    }
  }

  // Analytics utilities
  static calculateTrend(data) {
    if (data.length < 2) return { direction: "stable", change: 0 };

    const recent = data.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const previous = data.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;

    if (previous === 0) {
      return {
        direction: recent > 0 ? "up" : "stable",
        change: recent > 0 ? 100 : 0,
      };
    }

    const change = ((recent - previous) / previous) * 100;
    const direction = change > 5 ? "up" : change < -5 ? "down" : "stable";

    return { direction, change: Math.round(change) };
  }

  static generateId(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Export utilities
  static downloadFile(content, filename, mimeType = "application/json") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  static sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
}

// Make Utils available globally
window.Utils = Utils;