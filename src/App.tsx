import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { TreeTable } from "primereact/treetable";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { AddTaskDialog } from "./components/task/AddTask";
import { mapTaskActivityToTree } from "./model/model-tree";
import { TaskActivityModel } from "./model/TaskActivityModel";
import { updateTask } from "./store/features/taskActivitySlice";
import { useAppDispatch, useAppSelector } from "./store/store";

function App() {
  const [nodes, setNodes] = useState({ root: [] });

  const taskActivities: TaskActivityModel[] = useAppSelector(
    (s) => s.taskActivity.taskActivities
  );

  const menu = useRef(null);

  const [addTaskToggle, setAddTaskToggle] = useState(false);
  const [taskParentNode, setTaskParentNode] = useState(0);
  const [isActivity, setIsActivity] = useState(false);
  const [taskTitle,setTaskTitle]=useState("");
  
  const appDispatch = useAppDispatch();
  const navigate=useNavigate();

  const toggleModal = () => {
    setAddTaskToggle(!addTaskToggle);
  };

  const addTaskOnClick = () => {
    setTaskParentNode(0);
    toggleModal();
  };

  const addActivityOnClick = () => {
    setIsActivity(true);
    toggleModal();
  };

  useEffect(() => {
    const treeData = mapTaskActivityToTree(taskActivities);

    console.log(treeData);
    setNodes({ root: treeData });
  }, [taskActivities]);

  const addSubTask = () => {
    toggleModal();
  };

  const addSubActivity=()=>{
    setIsActivity(true);
    toggleModal();
  }

  const userActionItems = [
    {
      label: "Add Task",
      icon: "pi pi-plus",
      command: () => addSubTask(),
    },
    {
      label: "Add Activity",
      icon: "pi pi-pencil",
      command:()=>addSubActivity()
    },
    {
      label: "View Report",
      icon: "pi pi-chart-pie",
      command:()=>navigate(`activityReport/${taskParentNode}?name=${taskTitle}`)
    },
  ];

  const userAction = (taskActivityRowData) => {
    return (
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-outlined text-500 border-0"
        onClick={(event) => {
          setTaskParentNode(taskActivityRowData.data.modelId);
          setTaskTitle(taskActivityRowData.data.name);
          menu.current.toggle(event);
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

          <div className="flex flex-column justify-content-center">
            <div className="col">
              <p className="text-xl text-800 font-bold my-4">Project Name</p>
            </div>
            <div className="col">
              <div className="my-4 flex flex-row column-gap-3 justify-content-evenly">
                <Button
                  label="Add Task"
                  icon="pi pi-user"
                  className="p-button-success mb-2"
                  onClick={() => addTaskOnClick()}
                  aria-controls="popup_menu"
                  aria-haspopup
                />

                <Button
                  label="Add Activity"
                  icon="pi pi-user"
                  className="p-button-outlined mb-2 text-600"
                  onClick={() => addActivityOnClick()}
                  aria-controls="popup_menu"
                  aria-haspopup
                />
              </div>
              <div>
                <div className="card">
                  <h5>Basic</h5>

                  <TreeTable value={nodes.root}>
                    <Column
                      field="name"
                      header="Name"
                      expander
                      editor={typeEditor}
                    ></Column>
                    <Column field="projectId" header="Name"></Column>
                    <Column field="modelId" header="TaskId"></Column>
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
