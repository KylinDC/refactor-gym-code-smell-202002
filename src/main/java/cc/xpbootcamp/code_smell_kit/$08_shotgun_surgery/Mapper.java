@Data
class CreateCommand {
    private List<String> parameters;
}

class WorkPlaceMapper {
    List<WorkPlaceParam> toWorkPlaceParam(CreateCommand command) {
        return Optional
            .ofNullable(command.getParameters())
            .ifPresent(params -> 
                params.stream().map(new WorkPlaceParam(paramStr)).collect(Collectors.toList()));
    }
}

class HomeMapper {
    List<HomeParam> toHomeParam(CreateCommand command) {
        return Optional
            .ofNullable(command.getParameters())
            .ifPresent(params ->
                params.stream().map(new HomeParam(paramStr)).collect(Collectors.toList()));
    }
}
