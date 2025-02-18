const TRASH_ICON = 'images/trash.png';
const TRASH_ALT = "Remove icon";
const TRASH_CLASS ="task";
const TASK_FAKE_CLASS = "fake";

const taskList = document.querySelector(".task-list ul");
/*Document метод querySelector () возвращает первый элемент 
(Element) документа, который соответствует указанному 
електору или группе селекторов. Если совпадений не найдено, 
возвращает значение null*/
const taskInput = document.querySelector(".task-input input");
const taskAndButton = document.querySelector(".task-input button");
const tasks = document.getElementsByClassName("task");
const fakeTasks = document.getElementsByClassName("fake");


const findNodeToInsertBefore = (mouseY) =>{
    let insertBefore = 0;

    const filteredTasks = [...tasks].filter(
        (task) => 
            task.style.position !== "absolute" &&
            !task.classList.contains(TASK_FAKE_CLASS)
    );

    filteredTasks.forEach((task, index) => {
        if (mouseY > task.getBoundingClientRect().top){
            insertBefore = index + 1;
        }
    });

        return insertBefore < filteredTasks.length 
        ? filteredTasks[insertBefore] 
        : undefined;
};

taskAndButton.addEventListener('click', () => {
    const value = taskInput.value;

    const task = createTask(value);
    taskList.appendChild(task);

    taskInput.value = '';
});

const createTaskButton = () => {
    const icon = document.createElement('img');
    icon.src = TRASH_ICON;
    icon.alt = TRASH_ALT;

    const button = document.createElement('button');
    button.appendChild(icon);
    button.type = 'button';

    return button;
};

const createTask = (name) => {
    const taskName = document.createElement("p");
    taskName.textContent = name;

    const button = createTaskButton();

    const task = document.createElement("li");
    task.classList.add(TRASH_CLASS);
    task.appendChild(taskName);
    task.appendChild(button);

    button.addEventListener('click', () => {
        task.remove();
    });

    task.addEventListener('mousedown', (e) => onMouseDown(e, task));

    return task;
};

const removeFakeTasks = () => {
    [...fakeTasks].forEach((node) => {
        node.remove();
    });
};



const addFakeTask = (task, y) => {
    removeFakeTasks();
    const insertBefore = findNodeToInsertBefore (y);

    removeFakeTasks();

    const fakeTask = task.cloneNode(true);

    fakeTask.style.width = '';
    fakeTask.style.position = '';
    fakeTask.style.left = ''; 
    fakeTask.style.top = '';
    fakeTask.classList.add(TASK_FAKE_CLASS);

    if(insertBefore){
        taskList.insertBefore(fakeTask, insertBefore);
    } else {
        taskList.appendChild(fakeTask);
    }
}


/* Логика для перемещения задач */
const onMouseDown = (e, task) => {
    if (e.target !== task){
        return;
    }

    task.style.width = `${task.getBoundingClientRect().width}px`;
    task.style.position = "absolute";
    task.style.left = `${e.clientX}px`; 
    task.style.top = `${e.clientY}px`;

    
    const onMouseMove = (e) => {
        task.style.left = `${e.clientX}px`; 
        task.style.top = `${e.clientY}px`;

        addFakeTask(task, e.clientY);
    };

    const onMouseUp = (e) => {
        const insertBefore = findNodeToInsertBefore(e.clientY);

        task.style.width = "";
        task.style.position = "";
        task.style.left = ""; 
        task.style.top = "";

        task.remove();

        if(insertBefore){
            taskList.insertBefore(task, insertBefore);
        } else {
            taskList.appendChild(task);
        }

        removeFakeTasks();

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };
    
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
};
