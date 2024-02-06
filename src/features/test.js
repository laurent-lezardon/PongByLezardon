import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "test",
  value: "Not set",
};

const testSlice = createSlice({
  name: "testSlice",
  initialState,
  reducers: {},
});

export default testSlice.reducer;
