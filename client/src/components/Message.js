import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ msg, status }) => {

  // info, danger, success - bootstrap options for message color
  return (
    <div className={`alert alert-${status === 'info' ? 'info' : 'danger'} alert-dismissible fade show`} role="alert">
      {msg}
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  )
}

// check the var type of the props
Message.propTypes = {
  msg: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
}

export default Message;