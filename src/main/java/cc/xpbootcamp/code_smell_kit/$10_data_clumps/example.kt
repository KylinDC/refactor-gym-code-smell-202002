package com.daimler.mbe.pay

import android.app.Activity
import android.content.Context
import androidx.appcompat.app.AppCompatActivity

class example {
    companion object {
        fun newInstance(
                cityCode: String,
                vehicleClass: VehicleClass,
                vehicleModel: VehicleModel,
                vehicleModelProduct: VehicleModelProduct,
                vehicleFinancePlanProduct: VehicleFinancePlanProduct? = null
        ): DealerSelectFragment = DealerSelectFragment().apply {
            arguments = Bundle().apply {
                putParcelable(KEY_VEHICLE_CLASS, vehicleClass)
                putParcelable(KEY_VEHICLE_PRODUCT, vehicleModelProduct)
                putSerializable(KEY_VEHICLE_MODEL, vehicleModel)
                putString(KEY_VEHICLE_CITY_CODE, cityCode)
                if (vehicleFinancePlanProduct != null) {
                    putParcelable(KEY_VEHICLE_FINANCE_PLAN_PRODUCT, vehicleFinancePlanProduct)
                }
            }
        }
    }
}
