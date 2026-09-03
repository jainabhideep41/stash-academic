# Stash Academic Portal - ProGuard & R8 Optimization Rules
# Google Play Store / App Store Production Hardening

# Preserve Capacitor and Plugin Interfaces
-keep public class com.getcapacitor.** { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    public <methods>;
}
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public <methods>;
    @com.getcapacitor.annotation.CapacitorPlugin public <methods>;
}

# Preserve Native Alarm & Main Activity
-keep class com.stash.academic.** { *; }
-keepclassmembers class com.stash.academic.MainActivity {
    public *;
}

# Preserve Javascript Interfaces for Web-to-Native Bridge
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve Annotations and Reflection Metadata
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# Suppress harmless warnings
-dontwarn com.google.android.gms.**
-dontwarn androidx.**
