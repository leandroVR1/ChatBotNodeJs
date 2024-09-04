// userState.js

const userStates = {};

// Obtener el estado actual de un usuario
function getUserState(userId) {
  return userStates[userId] || { stage: "initial" };
}

// Establecer el estado de un usuario
function setUserState(userId, state) {
  userStates[userId] = state;
}

// Limpiar el estado de un usuario
function clearUserState(userId) {
  delete userStates[userId];
}

module.exports = {
  getUserState,
  setUserState,
  clearUserState,
};