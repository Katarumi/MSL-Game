

function parseelement (element) {
	if (element == "F") element = "Fire";
	if (element == "A") element = "Water";
	if (element == "O") element = "Wood";
	if (element == "L") element = "Light";
	if (element == "D") element = "Dark";
	return element;
}

function parsemongrade (grade) {

return grade;
}

function parsevariant (variant) {
	if (variant == "CB") variant = "Critical Boost";
return variant;
}

function asc_sort(a, b){
    return ($(b).text()) < ($(a).text()) ? 1 : -1;
}

function dec_sort(a, b){
    return ($(b).text()) > ($(a).text()) ? 1 : -1;
}

window.onload = loadastromons;

function loadastromons() {
	tabledefault = $("#stats").html();

	var monlist = mondata.compendium.astromon;

		for (var i = 0; i < monlist.length; i++) {
			var curmon = monlist[i];
			var name = curmon.name;

			var gradetext = parsemongrade(curmon.grade);

			var elementtext = parseelement(curmon.element);

			var variant = "None";
			if (curmon.variant) {
				variant = parsevariant(curmon.variant);
			} else {
				curmon.variant = "None";
			}


			$("ul.mons").append("<li class='row' id='"+i+"' data-link='"+encodeURIComponent(name).toLowerCase().replace("'","%27")+"' data-name='"+encodeURIComponent(name).replace("'","%27")+"'><span class='name col-xs-3'>"+name+"</span> <span class='element col-xs-2'>"+elementtext+"</span> <span class='grade col-xs-2'>"+gradetext+"</span> <span class='classes col-xs-2'>"+curmon.normal+"</span><span class='classes col-xs-3'>"+curmon.active+"</span> </li>");

			if (!$("select.gradefilter:contains('"+parsemongrade(curmon.grade)+"')").length) {
				$("select.gradefilter").append("<option value='"+curmon.grade+"'>"+parsemongrade(curmon.grade)+"</option>");
			}

			if (!$("select.elementfilter:contains('"+parseelement (curmon.element)+"')").length) {
				$("select.elementfilter").append("<option value='"+parseelement (curmon.element)+"'>"+parseelement (curmon.element)+"</option>");
			}

			if (!$("select.variantfilter:contains(\""+parsevariant(variant)+"\")").length) {
				$("select.variantfilter").append("<option value='"+variant+"'>"+parsevariant(variant)+"</option>");
			}

			if (!$("select.normalfilter:contains(\""+curmon.normal+"\")").length) {
				$("select.normalfilter").append("<option value='"+curmon.normal+"'>"+curmon.normal+"</option>");
			}
			
			if (!$("select.activefilter:contains(\""+curmon.active+"\")").length) {
				$("select.activefilter").append("<option value='"+curmon.active+"'>"+curmon.active+"</option>");
			}
			

		}

		$("select.gradefilter option").sort(asc_sort).appendTo('select.gradefilter');
		$("select.gradefilter option[value=1]").before($("select.gradefilter option[value=All]"));
		$("select.gradefilter").val("All");

		$("select.elementfilter option").sort(asc_sort).appendTo('select.elementfilter');
		$("select.elementfilter option[value=1]").before($("select.elementfilter option[value=All]"))
		$("select.elementfilter").val("All");

		$("select.normalfilter option").sort(asc_sort).appendTo('select.normalfilter');
		$("select.normalfilter option[value=1]").before($("select.normalfilter option[value=All]"))
		$("select.normalfilter").val("All");

		$("select.activefilter option").sort(asc_sort).appendTo('select.activefilter');
		$("select.activefilter option[value=1]").before($("select.activefilter option[value=All]"))
		$("select.activefilter").val("All");

		$("select.variantfilter option").sort(asc_sort).appendTo('select.variantfilter');
		$("select.variantfilter option[value=1]").before($("select.variantfilter option[value=All]"))
		$("select.variantfilter").val("All");

		var options = {
			valueNames: ['name', 'element', 'grade', 'normal', 'active'],
			listClass: "mons"
		}

		var monslist = new List("listcontainer", options);
		monslist.sort ("name")

		$("ul.list li").mousedown(function(e) {
			if (e.which === 2) {
				console.log("#"+$(this).attr("data-link").toLowerCase())
				window.open("#"+$(this).attr("data-link").toLowerCase(), "_blank").focus();
				e.preventDefault();
				e.stopPropagation();
				return;
			}
		});

		$("ul.list li").click(function(e) {
			usemon($(this).attr("id"));
			document.title = decodeURIComponent($(this).attr("data-name")).replace("%27","'") + " - MSLTools Astromons";
			window.location = "#"+$(this).attr("data-link").toLowerCase();
		});

		if (window.location.hash.length) {
			$("ul.list li[data-link='"+window.location.hash.split("#")[1].toLowerCase()+"']:eq(0)").click();
		} else $("ul.list li:eq(0)").click();

		$("form#filtertools select").change(function(){
			console.log("Selection Changed");
			var gradefilter = $("select.gradefilter").val();
			var elementfilter = $("select.elementfilter").val();
			var variantfilter = $("select.variantfilter").val();
			var normalfilter = $("select.normalfilter").val();
			var activefilter = $("select.activefilter").val();

			monslist.filter(function(item) {
				var rightgrade = false;
				var rightelement = false;
				var rightnormal = false;
				var rightvariant = false;
				var rightactive = false;

				if (gradefilter === "All" || item.values().grade === gradefilter) rightgrade = true;
				if (elementfilter === "All" || item.values().element === elementfilter) rightelement = true;
				if (normalfilter === "All" || item.values().normal === normalfilter) rightnormal = true;
				if (activefilter === "All" || item.values().active === activefilter) rightactive = true;
				if (variantfilter === "All" || item.values().variant === variantfilter) rightvariant = true;
				if (rightgrade && rightelement && rightnormal && rightvariant && rightactive) return true;
				return false;
			});
		});

		$("#filtertools button.sort").on("click", function() {
			if ($(this).attr("sortby") === "asc") {
				$(this).attr("sortby", "desc");
			} else $(this).attr("sortby", "asc");
			monslist.sort($(this).data("sort"), { order: $(this).attr("sortby"), sortFunction: sortmons });
		});

			// reset button
			$("button#reset").click(function() {
				$("#filtertools select").val("All");
				$("#search").val("");
				monslist.search("");
				monslist.filter();
				monslist.sort("name");
				monslist.update();
			})
}

function sortmons(a, b, o) {
	if (o.valueName === "name") {
		return ((b._values.name.toLowerCase()) > (a._values.name.toLowerCase())) ? 1 : -1;
	}

	if (o.valueName === "element") {
		return ((b._values.element.toLowerCase()) > (a._values.element.toLowerCase())) ? 1 : -1;
	}


	if (o.valueName === "grade") {
		return (parseInt(bgrade) > parseInt(agrade)) ? 1 : -1;
	}

	return 1;

}

function usemon (id) {
			$("#stats").html(tabledefault);
			var monlist = mondata.compendium.astromon;
			var curmon = monlist[id];

			$("th#name").html("<span title=\""+parseelement(curmon.element)+"\" class='element "+parseelement(curmon.element)+"'>"+parseelement(curmon.element)+"</span> "+curmon.name);

			// $("th#name").html(curmon.name);

			/*
			if (curmon.grade[0] !== "P") {
				$("td span#element").html(parseelement(curmon.element));
				if (curmon.grade === "0") {
					$("td span#element").css('textTransform', 'capitalize');
					$("td span#grade").css('textTransform', 'lowercase!important');
					$("td span#grade").html(" cantrip").detach().appendTo("td span#element");
				} else {
					$("td span#element").css('textTransform', 'lowercase');
					$("td span#grade").html(parsemongrade (curmon.grade)+"-grade");
				}

				if (curmon.ritual === "YES") {
					$("td span#ritual").show();
				} else $("td span#ritual").hide();

				$("td#components span").html(curmon.components);
				$("td#range span").html(curmon.range);
				$("td#castingtime span").html(curmon.time);
				$("td#duration span").html(curmon.duration);
			} else {
				var psitype = "";
				if (curmon.grade[1] === "D") {
					psitype = curmon.classes.split(/Mystic \(/g)[1].split(")")[0];
					psitype += " Discipline";
				} else if (curmon.grade[1] === "T") {
					psitype = "Psionic Talent";
				}
				$("td#gradeelementritual").html(psitype);
				$("td#castingtime").html("");
				$("td#range").html("");
				$("td#components").html("");
				$("td#duration").html("");
			}
			*/

			$("tr.text").remove();
			/*
			var textlist = curmon.text;
			var texthtml = "";

			if (textlist[0].length === 1) {
				texthtml = "<p>"+textlist+"</p>";
			} else for (var i = 0; i < textlist.length; i++) {
				if (!textlist[i]) continue;
				if (curmon.grade[0] !== "P") {
					texthtml = texthtml + "<p>"+textlist[i].replace("At Higher Levels: ", "<strong>At Higher Levels:</strong> ").replace("This mon can be found in the Elemental Evil Player's Companion","").replace(/^.*\:/g,"<strong>$&</strong>")+"</p>";
				} else {
					texthtml = texthtml + "<p>"+textlist[i].replace(/^.*(\(.*psi.*?\)|Psychic Focus|Bestial Transformation)\./g,"<strong>$&</strong>")+"</p>";
				}
			}
			$("tr#text").after("<tr class='text'><td colspan='6' class='text"+i+"'>"+texthtml+"</td></tr>");
			*/

			$("td#classes span").html(curmon.classes);

			return;
		};