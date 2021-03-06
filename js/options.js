function updateStatus(message) {
	var status = document.getElementById('status');
	status.textContent = message;
	setTimeout(function() {
		status.textContent = '';
	}, 750);
}

function saveOptions() {
	chrome.storage.sync.set({
		quizletId: document.getElementById('quizlet_id').value,
		quizletSet: $("#quizlet_set option:selected").attr("value"),
	}, function() {
		updateStatus('Options saved');
	});
}

function restoreOptions() {
	chrome.storage.sync.get(
		["quizletId", "quizletSet"],
		function(items) {
			keyFromLocal("quizletSets", function(err, sets) {
				if (err) {
					return updateStatus(err);
				}
				items.quizletSets = sets;
				optionsLoaded(items);
			});
		}
	);
}

function optionsLoaded(items) {
	document.getElementById('quizlet_id').value = items.quizletId;
	var select = $("#quizlet_set");
	if (items.quizletSets !== undefined) {
		for (var i in items.quizletSets.folders) {
			var folder = items.quizletSets.folders[i];
			var optGroup = $("<optgroup/>");
			optGroup.attr("label", folder.title);
			select.append(optGroup);
			for (var j in folder.sets) {
				var set = folder.sets[j];
				var opt = $("<option/>");
				opt.attr("value", set.url);
				opt.append(set.title);
				if (items.quizletSet === set.url) {
					opt.attr("selected", true);
				}
				optGroup.append(opt);
			}
		}
	}
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
