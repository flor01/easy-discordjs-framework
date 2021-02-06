const sqlite3 = require("sqlite3");
let memory = {};
let ready = false;
let sqlite = new sqlite3.Database(`database.sqlite`);
let i = setInterval(() => {
  if (!sqlite.open) return;
  clearInterval(i);
  sqlite.run("CREATE TABLE IF NOT EXISTS framework (key TEXT, value TEXT);", () => {
    sqlite.all("SELECT * FROM framework;", (err, data) => {
      if (err) throw err;
      data.forEach(d => {
        memory[d.key] = JSON.parse(d.value);
      });
      ready = true;
    });
  });
});


function isReady() {
  return new Promise((res) => {
    let i = setInterval(() => {
      if (!ready) return;
      res();
      clearInterval(i);
    }, 10);
  })
}

function get(key) {
  if (memory[key]) return memory[key];
  return new Promise((res) => {
    sqlite.all(`SELECT value FROM framework WHERE key='${key}';`, [], (err, data) => {
      if (err) throw err;
      if (data.length === 0) return res(undefined);
      res(data[0].key);
    });
  });
}

function set(key, value) {
  memory[key] = value;
  return new Promise((res) => {
    sqlite.all(`SELECT * FROM framework where key='${key}'`, [], (err, data) => {
      if (err) throw err;
      let sql = "";
      if (data.length === 0) sql = `INSERT INTO framework (key, value) VALUES ('${key}', '${JSON.stringify(value)}')`;
      else sql = `UPDATE framework SET value='${JSON.stringify(value)}' WHERE key='${key}'`;
      sqlite.all(sql, [], (err) => {
        if (err) throw err;
        res(true);
      });
    });
  });
}

function _delete(key) {
  delete memory[key];
  return new Promise((res) => {
    sqlite.all(`DELETE FROM framework WHERE key='${key}'`, [], (err) => {
      if (err) throw err;
      res(true);
    });
  });
}
module.exports = { isReady, get, set, delete: _delete }