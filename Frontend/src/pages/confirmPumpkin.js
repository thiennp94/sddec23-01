import React from 'react';

function confirmPumpkin() {
    return (
      <form action="/api/confirmed" method="post">
        <label for="pid">Are you sure this is your pumpkin?:</label>
      <button type="confirm">Confirm</button>
    </form>
    );
}

export default confirmPumpkin;