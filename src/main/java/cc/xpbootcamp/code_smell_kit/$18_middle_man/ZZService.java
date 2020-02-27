public class ZZService {

    @Override
    public void sendMessage(String toId, String src, boolean isOrigin, PluginCallback Callback) {
        ZZHelper.getInstance().sendMessage(toId, src, isOrigin, Callback);
    }

    @Override
    public void initNotifyConfig(Class<? extends Activity> activityClass, @DrawableRes int drawable) {
        ZZHelper.getInstance().initNotifyConfig(activityClass, drawable);
    }

}
