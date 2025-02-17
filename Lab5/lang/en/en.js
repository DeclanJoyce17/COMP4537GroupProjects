const MESSAGES = {
    INVALID_SQL: "Invalid SQL input.",
    ONLY_SELECT_INSERT: "Only SELECT and INSERT queries are allowed.",
    QUERY_SUCCESS: "Query executed successfully.",
    NO_PATIENTS_FOUND: "No patients found.",
    UNKNOWN_ERROR: "Unknown error",
    ROW_INSERT_SUCCESS: (index, name) => `Row ${index} inserted successfully: ${name}\n`,
    ROW_INSERT_CONFLICT: (index, name) => `Row ${index} conflict occurred: ${name}\n`,
    ROW_INSERT_ERROR: (index, name, error) => `Error inserting row ${index}: ${name} - ${error}\n`,
    ERROR_MESSAGE: (message) => `Error: ${message}`
    
};

window.MESSAGES = MESSAGES;
