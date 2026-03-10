async function loadData() {
    let res = await fetch("api.php");
    let data = await res.json();

    let html = "";
    data.forEach(user => {
        html += `<tr>
            <td>${user.name}</td>
            <td>${user.until_date}</td>
            <td>${user.note}</td>
        </tr>`;
    });

    document.getElementById("tableBody").innerHTML = html;
}

async function addRest() {
    let formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("until", document.getElementById("until").value);
    formData.append("note", document.getElementById("note").value);

    await fetch("api.php", {
        method: "POST",
        body: formData
    });

    loadData();
}

loadData();