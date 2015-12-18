#WDI Project 4: WikiSentiment
![preview](/wiki.png)

## Technologies used
Node.js
Express.js
MongoDB with Mongoose ORM
Sentiment module for sentiment analysis
Request for http requests
Async for sequential processing
AngularJS for front-end MVC
d3js for data visualization
Bootstrap for styling

## API's
WikiMedia api for gathering data from Wikipedia

## Summary
This is a data visualization and sentiment analysis app. It uses the WikiMedia API to query Wikipedia, then analyzes the text of articles using the Sentiment node module. Along with the sentiment analysis score, the app also provides a word cloud using d3js for its circle packing layout. Since Sentiment is already providing us with a list of positive an negative words, the word cloud is also color-coded. This way it visualizes both word frequency and word positivity or negativity.

## Implementation
The back-end is Node and MongoDB. The front end uses Angular to hit my API and display the data using d3js.  D3 is packaged into its own service and injected where necessary. Right now the bubble chart is the only d3 layout I use, but this implementation makes it easy to create new directives for other types of charts.

## Ongoing issues and future implementations
One of the first things I would add is a user model with authentication. Since the app is more geared towards exploration and visualization, I don't really have any data that would be associated with a user. I could potentially store a search history, but I felt that people don't generally want to spend the time to create an account for a website when they don't have to.  The other change I would make is to create a more responsive chart design.  The chart resizes with the window, but it would be useful to remove word circles that are too small to read.  More comparison lists would be cool as well.

##Link to design docs
https://www.dropbox.com/sh/p56tteam4jyihtp/AAAOr773SsvI-B2W-bXvoZp1a?dl=0

##User Stories
1. I'm a Wikipedia contributor and just wrote an article. I think that Wikipedia articles should be neutral and unbiased, so I run my article through the app to get a sentiment score. The score of -200 suggests that my article was too negative, so I look at the word cloud and pick out some of the larger red circles. Those are the most frequent negative words in my article, so I can go edit it and reduce the frequency of those words.

2. I'm a sports fan and I'm interested in how scandals have effected the tone of Wikipedia articles about certain athletes.  I use this app to compare the scores and word clouds for articles on athletes that have had scandals, like Tiger Woods and Lance Armstrong, to more pristine athletes, such as Peyton Manning and Roger Federer.
