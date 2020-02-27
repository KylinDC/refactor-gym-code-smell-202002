public class Enrolled {
    Mono<CustomerAchievedOrExpired> customerAchievedM = ...

    protected Flux<EnrolledActivity> enrolledPromotions(String customerId,
                                                         Predicate<Activity> activityPredicate) {
        
        // Temporary field: customerAchievedM.
        // Purpose: cache achieved promotions reduce api call from downstream
        Flux<FlaggedEnrolled> flaggedEnrolled = enrollmentService.getEnrolledIds(customerId)
            .collectList().flatMapMany(activityService::ofIdIn)
            .filter(activityPredicate)
            .flatMap(activity -> customerAchievedM.flatMap(
                        customerAchieved -> composeProgressFromDbOrMsr(customerId, activity, customerAchieved));
            );

        return flaggedEnrolled
            .map(FlaggedEnrolled::getEnrolled)
            .doOnComplete(() -> doSaveNewFinishedProgress(customerAchievedM, flaggedEnrolled));

    }

    // call api if result not cachede by customerAchievedM
    private Mono<FlaggedEnrolledPromotion> composeProgressFromDbOrMsr(
        String customerId, Activity activity, CustomerAchievedOrExpired customerAchieved) {
        Optional<Progress> progressOp = customerAchieved.ofId(activity.getId());
        
        return barcodeService.existedBarcode(customerId, activity.getId())
            .map(barcode -> {
                if (progressOp.isPresent()) {
                    progressOp.get().setCustomerId(customerId);//add customerId
                    return Mono.just(FlaggedEnrolled.of(activity, progressOp.get(), barcode, false));
                } else {
                    return enrollmentService.progress(customerId, activity.getId()).map(
                        progress -> FlaggedEnrolled.of(activity, progress, barcode, true));
                }
            })
            .flatMap(t -> t);
    }

    // only a small part of data (shouldBeCached) may eligible to cache into customerAchievedM
    private void doSaveNewFinishedProgress(Mono<CustomerAchievedOrExpired> customerAchievedM,
                                           Flux<FlaggedEnrolled> flaggedEnrolled) {

        flaggedEnrolled.filter(FlaggedEnrolled::shouldBeCached)
            .map(FlaggedEnrolled::getEnrolled)
            .collectList()
            .filter(x -> !x.isEmpty()) // if no new, do nothing.
            .flatMap(newAchieved -> customerAchievedM.map(customerAchieved ->
                customerAchieved.addAchievedOrExpired(newAchieved)))
            .flatMap(customerAchievedService::save)
            .subscribe();
    }
    
    boolean shouldBeCached() {
            if (!isNew()) {
                return false;
            }
            
            if (!enrolled.isFinished() && !getEnrolled().isExpired()) {
                return false;
            }
            if (!getEnrolled().getActivity().containsGiftRewardType()) {
                return false;
            }
            if (getEnrolled().getProgress().getProgressOf(Progress.Attribute.REWARD_REMAINING) != 0) {
                return false;
            }
            if (getEnrolled().getProgress().getValueOf(Progress.Attribute.COUPON_CODE) == null
                || !getEnrolled().hasBarcode()) {
                return false;
            }
            return true;
        }
}
