/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { expect } from "vitest";
import "@testing-library/jest-dom";
import Modal from 'react-modal';
const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);
Modal.setAppElement('#root');