export enum SQLQuery {
    GET_CURRENT_USER = 'SELECT * FROM user',
    DELETE_CURRENT_USER = 'DELETE FROM user',
    SAVE_CURRENT_USER = 'INSERT INTO user (id, name, phone_number, avatar_url, password) VALUES (?, ?, ?, ?, ?)',
    UPDATE_CURRENT_USER = 'UPDATE user SET name = ?, avatar_url = ? WHERE id = ?',
    GET_CONTACT_LIST = 'SELECT * FROM contact',
    ADD_CONTACT = 'INSERT INTO contact(id, name, last_seen, phone_number, avatar_url) VALUES (?, ?, ?, ?, ?)',
    UPDATE_CONTACT_INFO = 'UPDATE contact SET name = ?, avatar_url = ?, last_seen = ? WHERE id = ?',
    CHAT_PREVIEW_LIST = 'SELECT chats_preview.*, COUNT(msg.id) as unread_messages FROM' +
        '  (SELECT ch.id, ' +
        '          CASE COUNT(partisipant.id) WHEN 1 THEN GROUP_CONCAT(partisipant.name) ELSE ch.name END name, ' +
        '          CASE COUNT(partisipant.id) WHEN 1 THEN GROUP_CONCAT(partisipant.avatar_url) ELSE ch.avatar_url END avatar_url, ' +
        '     ch.last_read_message_id, m.message as last_message_text, m.date_sent as last_message_date,' +
        '     c.name as last_message_sender_name FROM chat as ch' +
        '   LEFT JOIN message as m ON ch.last_message_id = m.id' +
        '   LEFT JOIN contact as c ON m.sender_id = c.id' +
        '   LEFT JOIN chat_has_contacts as chc ON ch.id = chc.chat_id' +
        '   LEFT JOIN contact as partisipant ON chc.contact_id = partisipant.id' +
        '   GROUP BY ch.id) as chats_preview' +
        ' LEFT JOIN message as msg ON chats_preview.id = msg.chat_id AND msg.date_sent > (SELECT COALESCE((SELECT date_sent FROM message WHERE id = chats_preview.last_read_message_id), "2000-01-01 12:00:00.120"))' +
        ' GROUP BY chats_preview.id' +
        ' ORDER BY chats_preview.last_message_date DESC',
    CHAT_PREVIEW_LIST_BY_NAME = 'SELECT ch.id FROM chat as ch\n' +
        '         JOIN chat_has_contacts as chc ON ch.id = chc.chat_id\n' +
        '         GROUP BY ch.id\n' +
        '         HAVING COUNT(chc.contact_id) = 1 AND GROUP_CONCAT(chc.contact_id) = ?',
    CHAT_BY_ID = 'SELECT ch.id as chatId, ch.name as chatName, ch.avatar_url as chatAvatar, ' +
        'ch.last_read_message_id, c.id as participantId, c.name as participantName, c.avatar_url as participantAvatar, ' +
        'm.id as messageId, m.message, m.sender_id, m.date_sent FROM chat as ch\n' +
        ' JOIN chat_has_contacts chc ON ch.id = chc.chat_id\n' +
        ' JOIN contact c ON chc.contact_id = c.id \n' +
        ' LEFT JOIN message m ON ch.id = m.chat_id\n' +
        ' WHERE ch.id = ? ORDER BY m.date_sent, m.id ',
    ADD_CHAT = 'INSERT INTO chat (id, name, avatar_url) VALUES (?, ?, ?)',
    ADD_MEMBER_TO_CHAT = 'INSERT INTO chat_has_contacts (chat_id, contact_id) VALUES (?, ?)',
    ADD_MESSAGE = 'INSERT INTO message (message, date_sent, chat_id, sender_id) VALUES ( ?, ?, ?, ?)',
    UPDATE_LAST_READ_MESSAGE_IN_CHAT_BY_ID = 'UPDATE chat SET last_read_message_id = ? WHERE id = ?',
    UPDATE_LAST_MESSAGE_IN_CHAT_BY_ID = 'UPDATE chat SET last_message_id = ? WHERE id = ?',
}
