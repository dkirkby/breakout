// Prefilled google form URL to use.
const prefilled = 'https://docs.google.com/forms/d/e/1FAIpQLSfTy8nvjDkOQK56eIL9PoUfKFR2w-lUFJZTj2fIia5fPid_7A/viewform?usp=pp_url&entry.2084429172=1&entry.1939345773=2&entry.3698849=3&entry.1848598571=4';

$(document).ready(function() {
    // Parse query params.
    const params = new URLSearchParams(window.location.search);
    const activity = params.has('q') ? params.get('q') : 'notset';
    const nquestions = params.has('n') ? params.get('n') : 10;
    if(!params.has('debug')) $('#output').css('display', 'none');
    // Parse prefilled URL.
    const entries = Array.from(new URL(prefilled).searchParams)
        .filter(([k,v]) => k.startsWith('entry.'))
        .map(([k,v],i) => k);
    const url = new URL(prefilled.replace('viewform', 'formResponse'));
    url.search = '';
    const actionURL = url.toString();
    console.log(actionURL);
    // Add a form to answer each question.
    $("#questions").hide();
    for(let n=0; n < nquestions; n++) {
        const form = $('<form>', {action:actionURL, method:'POST', target:'output', class:'question'});
        form.append($('<input>', {value:'unknown', class:'team', type:'hidden', name:entries[0]}));
        form.append($('<input>', {value:activity, type:'hidden', name:entries[1]}));
        form.append($('<input>', {value:n+1, type:'hidden', name:entries[2]}));
        const labelled = $('<label>').text('Question ' + (n+1));
        labelled.append($('<textarea>', {class:'answer', name:entries[3],
            placeholder:'Enter your answer to question '+(n+1)}));
        form.append(labelled);
        form.append($('<button>', {type:'submit'}).text('SUBMIT ANSWER'));
        $('#questions').append(form);
    }
    $(".question").submit(function(e) {
        const form = $(this);
        if(form.find('textarea').val().trim() == '') {
            alert('Please enter your answer before submitting.');
            e.preventDefault();
        }
        else {
            $(this).find('button').text('UPDATE ANSWER');
        }
        // Uncomment the next line to test without submitting a new google form.
        //e.preventDefault();
    });
    $("#setup").submit(function(e) {
        const team = this.elements['breakout'].value.trim();
        if(team != '') {
            // Prefill team into each question form.
            $('#questions .team').val(team);
            // Reveal the questions.
            $('#questions').show();
        }
        else alert('Please enter your group members.');
        e.preventDefault();
    });
});
