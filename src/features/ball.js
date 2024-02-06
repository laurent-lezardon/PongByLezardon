import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  diameter: 16,
  xMove: 2,
  yMove: -1,
  xPosition: Math.floor(Math.min(innerWidth, 800) / 2),
  yPosition: Math.floor((Math.min(innerWidth, 800) * 3) / 10),
};

const ballSlice = createSlice({
  name: "ballSlice",
  initialState,
  reducers: {
    updateXY: (state, action) => {
      state.xPosition = action.payload.newX;
      state.yPosition = action.payload.newY;
    },
    changeXMove: (state, action) => {
      state.xMove = action.payload === "toLeft" ? -2 : 2;
      state.xPosition += state.xMove;
    },
    changeYMove: (state, action) => {
      state.yMove = action.payload === "Up" ? -1 : 1;
      state.yPosition += state.yMove;
    },
    newBall: (state, action) => {
      state.xPosition = Math.floor(action.payload / 2);
      state.yPosition = Math.floor((action.payload * 3) / 10);
    },
  },
});

export default ballSlice.reducer;
export const { updateXY, changeXMove, changeYMove, newBall } =
  ballSlice.actions;
