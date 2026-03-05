import { createSlice } from "@reduxjs/toolkit";
import { Action } from "@remix-run/router";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        addFeed: (state, action) => action.payload,
        removeFeed: () => [],
        removeUserFromFeed: (state, action) => {
            return state.filter((request) => request._id.toString() !== action.payload.toString());
        }
    }
})

export const { addFeed, removeFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
