import {
	inputEnabled,
	setDiv,
	message,
	setToken,
	token,
	enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let jobsDiv = null;
let jobsTable = null;
let jobsTableHeader = null;

export const handleJobs = () => {
	jobsDiv = document.getElementById("jobs");
	const logoff = document.getElementById("logoff");
	const addJob = document.getElementById("add-job");
	jobsTable = document.getElementById("jobs-table");
	jobsTableHeader = document.getElementById("jobs-table-header");

	jobsDiv.addEventListener("click", async (e) => {
		if (inputEnabled && e.target.nodeName === "BUTTON") {
			if (e.target === addJob) {
				showAddEdit(null);
			} else if (e.target === logoff) {
				setToken(null);

				message.textContent = "You have been logged off.";

				jobsTable.replaceChildren([jobsTableHeader]);

				showLoginRegister();
			} else if (e.target.classList.contains("editButton")) {
				message.textContent = "";
				showAddEdit(e.target.dataset.id);
			} else if (e.target.classList.contains("deleteButton")) {
				const jobId = e.target.dataset.id;
				const company = document.querySelector(
					`#job-${jobId}-company`,
				).textContent;
				const position = document.querySelector(
					`#job-${jobId}-position`,
				).textContent;
				const status = document.querySelector(
					`#job-${jobId}-status`,
				).textContent;
				if (
					confirm(
						`Delete the job from ${company} for position ${position}. Status: ${status}?`,
					)
				) {
					try {
						const response = await fetch(`/api/v1/jobs/${jobId}`, {
							method: "DELETE",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
						});

						const data = await response.json();
						if (response.status === 200) {
							message.textContent = `Deleted the job from ${company} for position ${position}. Status: ${status}`;
							showJobs();
						} else {
							// might happen if the list has been updated since last display
							message.textContent = "The jobs entry was not found";
							showJobs();
						}
					} catch (err) {
						console.log(err);
						message.textContent = "A communications error has occurred.";
						showJobs();
					}
				}
			}
		}
	});
};

export const showJobs = async () => {
	try {
		enableInput(false);

		const response = await fetch("/api/v1/jobs", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		const data = await response.json();
		const children = [jobsTableHeader];

		if (response.status === 200) {
			if (data.count === 0) {
				jobsTable.replaceChildren(...children); // clear this for safety
			} else {
				for (let i = 0; i < data.jobs.length; i++) {
					const rowEntry = document.createElement("tr");

					const editButton = `<td><button type="button" class="editButton" data-id=${data.jobs[i]._id}>edit</button></td>`;
					const deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.jobs[i]._id}>delete</button></td>`;
					const rowHTML = `
            <td id="job-${data.jobs[i]._id}-company">${data.jobs[i].company}</td>
            <td id="job-${data.jobs[i]._id}-position">${data.jobs[i].position}</td>
            <td id="job-${data.jobs[i]._id}-status">${data.jobs[i].status}</td>
            <div>${editButton}${deleteButton}</div>`;

					rowEntry.innerHTML = rowHTML;
					children.push(rowEntry);
				}
				jobsTable.replaceChildren(...children);
			}
		} else {
			message.textContent = data.msg;
		}
	} catch (err) {
		console.log(err);
		message.textContent = "A communication error occurred.";
	}
	enableInput(true);
	setDiv(jobsDiv);
};
