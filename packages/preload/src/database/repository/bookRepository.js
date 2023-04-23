import { getConnection, runQuery } from "../createConnection";

async function getAllBooks() {
    const con = await getConnection();
    const query = "SELECT title, asin FROM BOOK_INFO";
    return await runQuery(query);
}

async function getBookByAsin(asin) {
    const con = await getConnection();
    const query = `
    SELECT
      b.title as title,
      b.authors as author,
      strftime('%m/%d/%Y', datetime(MIN(w.timestamp) /1000, 'unixepoch')) minTime,
      strftime('%m/%d/%Y', datetime(MAX(w.timestamp) /1000, 'unixepoch')) maxTime,
      IFNULL(count(*), 0) as wordCount
    FROM
      WORDS w
      LEFT JOIN LOOKUPS l ON l.word_key=w.id
      LEFT JOIN BOOK_INFO b ON b.guid=l.book_key
    WHERE
      b.asin = ?
    GROUP BY
      b.title
    ORDER BY
      minTime ASC;
    `;
    return await runQuery(query, [asin], "get");
}

async function getBooksByDate(date) {
    const query = `
    SELECT 
        DISTINCT title, asin
    FROM (
        SELECT l.book_key, b.asin, b.title, date(w.timestamp / 1000, 'unixepoch') AS word_date
        FROM WORDS w
        LEFT JOIN LOOKUPS l ON l.word_key = w.id
        LEFT JOIN BOOK_INFO b ON b.guid = l.book_key
    ) t
    where t.word_date = ?
    `;
    return await runQuery(query, [date]);
}

async function getBookCount() {
    const query = "SELECT COUNT(*) as bookCount FROM BOOK_INFO";
    return await runQuery(query, [], "get");
}

async function getBookTitleById(id) {
    const query = `
    SELECT book_info.title, lookups.usage, lookups.timestamp 
    FROM book_info 
    JOIN lookups ON book_info.id = lookups.book_key 
    WHERE book_info.id = ?
    `;
    return await runQuery(query, [id], "get");
}
export const bookRepo = {
    getAllBooks,
    getBookByAsin,
    getBooksByDate,
    getBookCount,
    getBookTitleById,
};
