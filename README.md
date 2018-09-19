# A simple React.js based testable, parcel-bundler based start kit

This is a simple [parcel bundler](https://parceljs.org/) based react typecript jest testable development start kit. 

If you only want to develop A componenty library or develop some UX with react and integrate into your non-react web application, it is a good fit.

What you can do with this start kit are:

    * write your test in typescript
    * bare-bone, only depend on react and react-dom, you add 3rd party library as you like, like MOBX or redux
    * visual code editor based. it just works out of box.
    * HMR is out of the box. just run yarn start

You are welcomed to send your feedback to us so that we can improve this start kit and hope that it might help the beginners to start to work on application-specific.

**Note**

If you want to create react application, you might use [Create React App](https://github.com/facebook/create-react-app);

You might need to install parcel-bundler

 * sudo yarn global add parcel-bundler
 * sudo npm install -g parcel bundler

## Facebook Watchman

You might need to install facebook watchman, that react will use to watch on file changes for HMR. you might run into jest server stops due to the failure of jest test server running on the launching visual code editor.  What you need to do is increment the maximum setting for watchman as show below:

```sh

echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_queued_events
echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_instances
watchman shutdown-server

```

You might following the [Guard/listen](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers) to change these settings.
