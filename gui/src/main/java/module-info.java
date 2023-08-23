module com.zachtyson.gui {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.kordamp.bootstrapfx.core;
    requires com.google.gson;

    opens com.zachtyson.gui to javafx.fxml;
    exports com.zachtyson.gui;
}
