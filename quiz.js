(function() {

var app = angular.module('myQuiz',[]);
app.controller('QuizController',['$scope','$http','$sce', function($scope,$http,$sce) {
$scope.Math = window.Math;

$scope.score = 0;
$scope.activeQuestion = -1;
$scope.activeQuestionAnswered = 0;
$scope.percentage = 0;


$http.get('quiz_data.json').then(function(quizData){
  $scope.myQuestions = quizData.data;
  $scope.totalQuestions = $scope.myQuestions.length;
})
		// check answer that user clicked
      $scope.selectAnswer = function(qIndex,aIndex) {
        //setting a question state variable equal to the question state
        // on how it was answered by the index
          var questionState = $scope.myQuestions[qIndex].questionsState;

          if( questionState != 'answered') {
            $scope.myQuestions[qIndex].selectedAnswer = aIndex;
            var correctAnswer = $scope.myQuestions[qIndex].correct;
            $scope.myQuestions[qIndex].correctAnswer = correctAnswer;

            //see if item clicked on matches correct answered
            if( aIndex === correctAnswer ) {
              $scope.myQuestions[qIndex].correctness = 'correct';
              $scope.score += 1; //adds 1 to score
            } else {
                  $scope.myQuestions[qIndex].correctness = 'incorrect';
            }
            $scope.myQuestions[qIndex].questionState = 'answered';
          }
          // takes score divided by total questions multipled by 100
          // using toFixed to round off
          $scope.percentage = (($scope.score / $scope.totalQuestions)*100).toFixed(0);
        }
        $scope.isSelected = function(qIndex,aIndex) {
            //return t or f based on condition
            return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
        }
        $scope.isCorrect = function(qIndex,aIndex) {
            //return t or f based on condition
            return $scope.myQuestions[qIndex].correctAnswer === aIndex;
        }

        $scope.selectContinue = function() {
          return $scope.activeQuestion += 1; //increments active question by 1
        }
        // dynamically creates link to email and twitter that will be customized with user results
        $scope.createShareLinks = function(percentage){

          var url = 'https://margier.github.io/Space-Quiz/';

          var emailLink = '<a class="btn email" href="mailto:">Email a friend</a>';

          var twitterLink = '<a target="blank" class="btn twitter" href="http://twitter.com/share?text=I scored a '+percentage+'%25 on this quiz about Saturn. Try to beat my score at&amp;hashtags=SaturnQuiz&amp;url='+url+'">Tweet your score</a>';

          var newMarkup = emailLink + twitterLink;

            return $sce.trustAsHtml(newMarkup);

        }

      }]);

})();
