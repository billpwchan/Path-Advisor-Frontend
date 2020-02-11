import React from 'react';

function ImageLocalization() {
    return <h1> Hello World </h1>;
}

const PrimaryPanelPlugin = { Component: ImageLocalization, connect: [] };

const id = "helloWorld";
const name = "Hello World";
const defaultOff = true;

export { id, name, defaultOff, PrimaryPanelPlugin };