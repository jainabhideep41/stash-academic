package com.stash.academic;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    public static final String ALARM_CHANNEL_ID = "stash_alarm_channel_dnd_bypass";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Configure Hardware Fullscreen & Lockscreen Wake-Up Flags
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            );
        }

        // 2. Initialize Dedicated Native Android Alarm Notification Channel with DND Bypass
        createAlarmNotificationChannel();
    }

    private void createAlarmNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Stash Academic Alarms";
            String description = "High-urgency wake-up alarms that bypass Do Not Disturb and Silent mode";
            int importance = NotificationManager.IMPORTANCE_HIGH;

            NotificationChannel channel = new NotificationChannel(ALARM_CHANNEL_ID, name, importance);
            channel.setDescription(description);

            // Configure Alarm Audio Attributes (Direct to STREAM_ALARM hardware channel)
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_ALARM)
                .build();

            Uri alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (alarmSound == null) {
                alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
            }
            channel.setSound(alarmSound, audioAttributes);

            // Bypass Do Not Disturb
            channel.setBypassDnd(true);

            // Show on public lockscreen
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

            // Enable intense repeating vibration
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[]{0, 600, 200, 600, 200, 1000});

            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }
}
