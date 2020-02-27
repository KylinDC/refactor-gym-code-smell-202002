package com.daimler.mbe.pay

import android.app.Activity
import android.content.Context
import androidx.appcompat.app.AppCompatActivity


object PayServiceFactory {
    @SuppressLint("NewApi")
    private fun setDisableStyle(helper: BaseViewHolder, context: Context) {
        helper.itemView.setBackgroundResource(R.drawable.mbe_featured_config_disable_background)
        helper.itemView.foreground = ColorDrawable(ContextCompat.getColor(context, R.color.mbe_config_element_disable_color))
        helper.setEnabled(R.id.checkbox, false)
    }
    @SuppressLint("NewApi")
    private fun setEnableStyle(helper: BaseViewHolder) {
        helper.itemView.setBackgroundResource(R.drawable.mbe_featured_config_background)
        helper.itemView.foreground = null
        helper.setEnabled(R.id.checkbox, true)
    }
}
