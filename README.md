# Dynamic Schedule

## Synopsis
User can enter tasks with deadline and time estimate; one-off and repeating event; personal preferences such as repetitiveness, favorite times of day, session length, variety; system outputs a schedule based on these criteria; system updates schedule if user does not follow schedule exactly; keeps track of user performance so they can adapt their preferences accordingly.

## Core Features
### Task Recording
     User can enter tasks with deadline, hours estimated, and type; which then appear on the global task list
### Event Recording
     User can enter events with date and time
### Global Preferences
     User can edit the following preferences:
- Repetition: determines how much the routine changes from day to day (holding taskload constant)
- Work times: determines where the scheduler is allowed to place work sessions
- Session length: determines how long the scheduler will assign to work on a single task
- Variety: determines whether subsequent tasks are similar or disparate
### Schedule generation
     Based on the preferences, given the task and event lists, and for a specified period of time (i.e. the next 2 weeks), the system generates a schedule that leads to on-time completion of all tasks with time blocked for events, while optimizing for global preferences.
### Dynamic schedule
     When the schedule starts, there is a 'move to next task' button.  By default, the schedule re-calculates upon completion of a task,
     but if the 'don't recalculate' checkbox is checked, the schedule stays constant.

## Application Architecture
    ![](resources/img/dynamic_scheduler_architecture.png)

## DONE Database Design
    ![Link to dbdiagram.io](https://dbdiagram.io/d/6104a0a12ecb310fc3b79989)
*** DONE Wireframes
    [Link to Figma Board](https://www.figma.com/file/gOQIXCLraoBTbB8gEilh1U/Dyanamic-Scheduler-Wireframe?node-id=0%3A1)