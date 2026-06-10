import { GraderModel } from "./model.js";
import { GraderView } from "./view.js";
import { GraderController } from "./controller.js";

const model = new GraderModel();
const view = new GraderView();
const controller = new GraderController(model, view);

controller.init();