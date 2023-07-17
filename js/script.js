$(document).ready(function() {
    // Fetch question and answers from PHP script
function loadQuestion() {

    var questionContainer = $('.question-text');
    questionContainer.text("Cargando Pregunta...");

    $.ajax({
      url: 'https://thedstaff.com/php/get_questions.php',
      method: 'GET',
      dataType: 'json',
      success: function(response) {
        // Process the response containing the question and answers
        if (response && response.question && response.answers && response.difficulty && response.id) {
          var id = response.id;
          var question = response.question;
          var difficulty = response.difficulty;
          var answers = response.answers;
  
          // Display the question and answers on the page
          displayQuestionAndAnswers(id, question, difficulty, answers);
        } else {
          //console.log('Failed to fetch question and answers.');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar la pregunta.',
          });
        }
      },
      error: function(xhr, status, error) {
        //console.log('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error
        });
      }
    });
}

// Load the initial question
loadQuestion();
  
    // Submit answer to PHP script
    $('.submit-button').click(function() {
      // Get the selected answer
      var selectedAnswer = $('input[name="answer"]:checked').val();
      var id = $('input[name="hiddenField"]').val();
      
      var answersContainer = $('.answers');

      // Check if an answer is selected
      if (selectedAnswer) {
        // Send the answer to the PHP script
        $.ajax({
          url: 'https://thedstaff.com/php/check_answers.php',
          method: 'POST',
          data: { answer: selectedAnswer,question_id: id },
          dataType: 'json',
          beforeSend: function(objeto)
          {
              loading();
          },
          success: function(response) {
            // Process the response containing the answer check result
            if (response && response.result) {
              var isCorrect = response.result;

              // Display the result to the user
              //displayResult(isCorrect);
              Swal.fire({
                icon: 'success',
                title: 'Correcto',
                text: 'Respuesta Correcta!'
              }).then((result) =>
                {
                  answersContainer.empty();
                  stop_loading();
                  loadQuestion();
                }
              );

            } else {
              var correctText = response.correct_text
              Swal.fire({
                icon: 'error',
                title: 'Error',
                html: 'Respuesta incorrecta! <br> La respuesta correcta es: ' + correctText
              }).then((result) =>
              {
                answersContainer.empty();
                stop_loading();
                loadQuestion();
              }
            );
            }
          },
          error: function(xhr, status, error) {
            //console.log('Error:', error);
            stop_loading();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error
            });
          }
        });
      } else {
        //console.log('No answer selected.');
        stop_loading();
        Swal.fire({
          icon: 'warning',
          title: 'Oops!',
          text: 'Selecciona una respuesta.'
        });
      }
    });
  
    // Function to display the question and answer options on the page
    function displayQuestionAndAnswers(id,question, difficulty, answers) {
      
      $('input[name="hiddenField"]').val(id);

      var questionContainer = $('.question-text');
      var difficultyContainer = $('.question-difficulty');
      var answersContainer = $('.answers');
  
      questionContainer.text(question);
      difficultyContainer.text(difficulty);
  
      $.each(answers, function(key, value) {
        var answerDiv = $('<div class="answer">');
        var answerInput = $('<input type="radio" name="answer">')
          .attr('id', key)
          .val(key);
        var answerLabel = $('<label>')
          .attr('for', key)
          .text(value);
  
        answerDiv.append(answerInput, answerLabel);
        answersContainer.append(answerDiv);
      });
    }

    function loading()
    {
      $('.submit-button').attr("disabled","disabled");
      $('.submit-button').html("<i class='fa fa-circle-o-notch fa-pulse'></i> Validando");
    }

    function stop_loading()
    {
	    $('.submit-button').removeAttr("disabled");
	    $('.submit-button').html("Responder");
    }
  
  });
  
