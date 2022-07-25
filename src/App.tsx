import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { TreeTable } from "primereact/treetable";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { AddTaskDialog } from "./components/task/AddTask";
import { KeyDialog } from "./components/task/KeyDialog";
import { mapTaskActivityToTree } from "./model/model-tree";
import { TaskActivityModel } from "./model/TaskActivityModel";
import { updateTask } from "./store/features/taskActivitySlice";
import { useAppDispatch, useAppSelector } from "./store/store";

function App() {
  const taskActivities: TaskActivityModel[] = useAppSelector(
    (s) => s.taskActivity.taskActivities
  );

  const [nodes, setNodes] = useState({ root: [] });

  const [parentTasks, setParentTasks] = useState([]);

  const menu = useRef(null);
  const subTaskMenu = useRef(null);

  const [addTaskToggle, setAddTaskToggle] = useState(false);
  const [taskParentNode, setTaskParentNode] = useState(0);
  const [isActivity, setIsActivity] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [toggleKeyDialog, setToggleKeyDialog] = useState(false);

  const appDispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleModal = () => {
    setAddTaskToggle(!addTaskToggle);
  };

  const addTaskOnClick = () => {
    setIsActivity(false);
    setTaskParentNode(0);
    toggleModal();
  };

  useEffect(() => {
    const treeData = mapTaskActivityToTree(taskActivities);

    const parents = taskActivities.filter(
      (activity) => activity.parentId === 0
    );

    setParentTasks(parents);
    setNodes({ root: treeData });

    localStorage.setItem("task-data", JSON.stringify(taskActivities));
  }, [taskActivities]);

  const addSubTask = () => {
    toggleModal();
  };

  const addSubActivity = () => {
    setIsActivity(true);
    toggleModal();
  };

  const userActionItems = [
    {
      label: "Add Sub Activity",
      icon: "pi pi-pencil",
      command: () => addSubActivity(),
    },
    {
      label: "View Report",
      icon: "pi pi-chart-pie",
      command: () =>
        navigate(`activityReport/${taskParentNode}?name=${taskTitle}`),
    },
  ];

  const subTaskUserActionItems = [
    {
      label: "View Report",
      icon: "pi pi-chart-pie",
      command: () =>
        navigate(`activityReport/${taskParentNode}?name=${taskTitle}`),
    },
  ];

  const taskNameView = (taskRowData: TaskActivityModel) => {
    return (
      <span className={`${taskRowData.isActivity ? "text-pink-600" : ""}`}>
        {taskRowData.name}
      </span>
    );
  };

  const userAction = (taskActivityRowData) => {
    return (
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-outlined text-500 border-0"
        onClick={(event) => {
          const { data } = taskActivityRowData;
          console.log(taskActivityRowData);
          setTaskParentNode(data.modelId);
          setTaskTitle(data.name);
          if (!data.isActivity) {
            menu.current.toggle(event);
          } else {
            subTaskMenu.current.toggle(event);
          }
        }}
        aria-controls="popup_menu"
        aria-haspopup
      />
    );
  };

  const inputTextEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.rowData[options.field]}
        onChange={(e) => {
          appDispatch(
            updateTask({
              ...options.rowData,
              name: e.target.value,
            })
          );
        }}
      />
    );
  };

  const typeEditor = (options) => {
    return inputTextEditor(options);
  };

  const onShow = (rowData) => {
    console.log(rowData);
  };

  const actionTemplate = (node, column) => {
    return (
      <div className="px-4">
        <Button
          type="button"
          icon="pi pi-plus"
          className="p-button-outlined p-button-secondary mx-4 px-2"
        >
          <span className="px-2">Task</span>
        </Button>

        <Button
          type="button"
          icon="pi pi-plus"
          className="p-button-outlined p-button-secondary"
        >
          <span className="px-2">Activity</span>
        </Button>
      </div>
    );
  };
  return (
    <>
      <div className="bg-gray-100 h-screen w-screen">
        <div className="bg-white mt-4 mx-6 px-8">
          {addTaskToggle && (
            <AddTaskDialog
              onHide={toggleModal}
              visible={addTaskToggle}
              isActivity={isActivity}
              taskParentId={taskParentNode}
            />
          )}
          <Menu
            model={userActionItems}
            popup
            ref={menu}
            id="popup_menu"
            onShow={onShow}
          />

          <Menu
            model={subTaskUserActionItems}
            popup
            ref={subTaskMenu}
            id="popup_menu"
            onShow={onShow}
          />

          {toggleKeyDialog && (
            <KeyDialog
              visible={toggleKeyDialog}
              onHide={() => setToggleKeyDialog(!toggleKeyDialog)}
            />
          )}

          <div className="flex flex-column justify-content-center">
            <div className="col">
              {/* <p className="text-xl text-800 font-bold my-4">Project Name</p> */}
            </div>
            <div className="col">
              <div className="my-4 flex flex-row justify-content-evenly">
                <Button
                  label="Add Activity"
                  icon="pi pi-user"
                  className="p-button-outlined p-button-success p-button-sm"
                  onClick={() => addTaskOnClick()}
                  aria-controls="popup_menu"
                  aria-haspopup
                />
                <Button
                  type="button"
                  icon="pi pi-key"
                  className="p-button-outlined p-button-sm p-button-secondary"
                  label="Cost Code"
                  onClick={() => setToggleKeyDialog(!toggleKeyDialog)}
                />
              </div>
              <div>
                <div className="card mx-8" >
                  <p className="text-xl">Activities</p>

                  <TreeTable value={nodes.root}>
                    <Column
                      field="name"
                      header="Name"
                      expander
                      editor={typeEditor}
                    ></Column>
                    <Column header="Action" body={userAction}></Column>
                  </TreeTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
