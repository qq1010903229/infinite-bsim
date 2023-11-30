overlays.popup = {
    create(overlay, title, desc, actions, onaction = null) {
        let holder = document.createElement("div");
        overlay.append(holder);

        let titleBox = document.createElement("div");
        titleBox.classList.add("title");
        titleBox.textContent = title;
        holder.append(titleBox);

        let content = document.createElement("div");
        content.classList.add("content");
        content.append(desc);
        holder.append(content);

        let actionDiv = document.createElement("div");
        actionDiv.classList.add("action-list");
        content.append(actionDiv);

        for (let a = 0; a < actions.length; a++) {
            let button = document.createElement("button");
            button.classList.add("pushy-button", "mini");
            button.textContent = actions[a];
            button.onclick = () => {
                onaction?.(a);
                overlay.remove();
            }
            actionDiv.append(button);
        }
    },
}