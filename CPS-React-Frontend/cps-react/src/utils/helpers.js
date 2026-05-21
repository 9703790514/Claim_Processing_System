// src/utils/helpers.js

/**
 * Returns a human-readable label for a given claim status.
 * @param {string} status - The raw status string (e.g., 'status_raised').
 * @returns {string} The formatted status label.
 */
export const getStatusLabel = (status) => {
    switch (status) {
        case 'status_raised': return 'Raised';
        case 'status_pending': return 'Pending';
        case 'status_approved_by_field_doctor': return 'Approved by Field Doctor';
        case 'status_queried': return 'Under Query'; // alias if used
        case 'status_approved': return 'Approved';
        case 'status_settled': return 'Settled';
        case 'status_rejected': return 'Rejected';
        case 'status_rejected_by_field_doctor': return 'rejected';
        default:
            // Convert snake_case to Title Case as fallback
            return status
                .replace(/^status_/, '')
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
    }
};

/**
 * Formats a date string into a localized, short date format (e.g., "Jul 1, 2025").
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date or the original string if invalid.
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    try {
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        console.error("Invalid date string:", dateString, e);
        return dateString; // Return original if parsing fails
    }
};

/**
 * Formats a numeric amount into Indian Rupees currency format.
 * Handles string inputs by attempting to parse them to a number first.
 * @param {number|string} amount - The amount to format.
 * @returns {string} The formatted currency string or an empty string if invalid.
 */
export const formatAmount = (amount) => {
    if (typeof amount !== 'number') {
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount)) {
            amount = parsedAmount;
        } else {
            return ''; // Return empty string for non-numeric or unparseable amounts
        }
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};
