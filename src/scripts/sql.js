const Database = require("better-sqlite3");
const path = require("path");
const readline = require("readline");

// Resolve path to derank.db
const dbPath = path.join(__dirname, "../database/derank.db");
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

// Get command line query if provided
const argsQuery = process.argv.slice(2).join(" ").trim();

function runQuery(query) {
    if (!query) return;
    
    try {
        const stmt = db.prepare(query);
        
        // If it's a query that returns rows (SELECT, PRAGMA, etc.)
        if (stmt.reader) {
            const rows = stmt.all();
            if (rows.length > 0) {
                console.table(rows);
            } else {
                console.log("Empty result set (0 rows).");
            }
        } else {
            // INSERT, UPDATE, DELETE, CREATE, ALTER, etc.
            const result = stmt.run();
            console.log(`✅ Success. Changes: ${result.changes}, LastInsertRowid: ${result.lastInsertRowid}`);
        }
    } catch (err) {
        // Fallback for compound statement executions (e.g. schema definitions, multiple statements)
        try {
            db.exec(query);
            console.log("✅ Executed successfully (compound/schema statement).");
        } catch (execErr) {
            console.error("❌ Error running SQL:\n", execErr.message);
        }
    }
}

if (argsQuery) {
    // Run single command-line query
    runQuery(argsQuery);
    db.close();
} else {
    // Start interactive REPL
    console.log(`Interactive SQL Shell for derank.db`);
    console.log(`Database path: ${dbPath}`);
    console.log(`Commands: Type any SQL statement. Type '.exit' or press Ctrl+C to quit.\n`);
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "sqlite> "
    });

    rl.prompt();

    rl.on("line", (line) => {
        const query = line.trim();
        
        if (query.toLowerCase() === ".exit" || query.toLowerCase() === "exit") {
            rl.close();
            return;
        }
        
        if (query) {
            runQuery(query);
        }
        
        rl.prompt();
    }).on("close", () => {
        console.log("\nExiting SQL shell.");
        db.close();
        process.exit(0);
    });
}
