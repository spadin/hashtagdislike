function isReply({in_reply_to_status_id_str} = {}) {
  return in_reply_to_status_id_str !== undefined && in_reply_to_status_id_str !== null;
}

module.exports = isReply;

