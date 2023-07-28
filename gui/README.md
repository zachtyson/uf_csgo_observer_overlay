# What is this?

This is just a Java swing application that lets you run both the server and the client at the same time.
It's not really anything special, but it's nice to have.
In the future I plan on using it to modify setting such as bomb timer, round timer, team names, etc.

I will eventually get to that, but I'm going to focus on the actual overlay first.

My current idea is that I will package the backend using pkg (which I've already done) and then use electron-builder to package the frontend.

The backend probably won't be updated much, but the frontend will be updated a lot.
Ideally modifying the config within the GUI will modify the config file for the backend and frontend so that an end user 
doesn't have to manually edit the config files and can just use the GUI.

Why Java Swing? Why not literally anything else? Laziness.
